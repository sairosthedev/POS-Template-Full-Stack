import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Upload, CheckCircle2, AlertTriangle, X, FileText, FileSpreadsheet, FileType } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from './ui/Table';

const API = ''; // baseURL is configured globally (services/axios.config.js)

// Required product fields that must be mapped
const REQUIRED_FIELDS = ['name', 'category', 'price', 'cost'];
const PRODUCT_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'barcode', label: 'Barcode' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'cost', label: 'Cost' },
  { key: 'stock', label: 'Stock' },
  { key: 'unit', label: 'Unit' },
  { key: 'stockAlert', label: 'Stock Alert' },
  { key: '__skip', label: '-- Skip Column --' },
];

const STEPS = { UPLOAD: 'upload', MAP: 'map', PREVIEW: 'preview', RESULT: 'result' };

const ImportProductsModal = ({ isOpen, onClose, onImported }) => {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [fileName, setFileName] = useState('');
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMap, setColumnMap] = useState({});
  const [preview, setPreview] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const reset = () => {
    setStep(STEPS.UPLOAD);
    setFileName('');
    setRawHeaders([]);
    setRawRows([]);
    setColumnMap({});
    setPreview([]);
    setResult(null);
    setError('');
  };

  // ── Parse Excel / CSV via SheetJS ────────────────────────────────────────
  const parseExcelOrCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (json.length < 2) { setError('File has no data rows.'); return; }
        const headers = json[0].map(h => String(h).trim());
        const rows = json.slice(1).filter(r => r.some(c => c !== ''));
        setRawHeaders(headers);
        setRawRows(rows);
        // Auto-map: try to find matching column names
        const autoMap = {};
        headers.forEach((h, i) => {
          const match = PRODUCT_FIELDS.find(f => f.label.toLowerCase() === h.toLowerCase() || f.key.toLowerCase() === h.toLowerCase());
          autoMap[i] = match ? match.key : '__skip';
        });
        setColumnMap(autoMap);
        setStep(STEPS.MAP);
        setError('');
      } catch {
        setError('Could not parse this file. Ensure it is a valid Excel or CSV file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ── Parse PDF: extract text lines and attempt tabular detection ──────────
  const parsePDF = async (file) => {
    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let allLines = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        const lineMap = {};
        content.items.forEach(item => {
          const y = Math.round(item.transform[5]);
          lineMap[y] = lineMap[y] ? lineMap[y] + ' ' + item.str : item.str;
        });
        const sorted = Object.keys(lineMap).sort((a, b) => b - a).map(k => lineMap[k].trim());
        allLines = allLines.concat(sorted.filter(l => l.length > 0));
      }

      // Detect delimiter by scanning all lines
      const detectDelimiter = (lines) => {
        const counts = { ',': 0, ';': 0, '\t': 0, '|': 0 };
        lines.slice(0, 10).forEach(l => {
          Object.keys(counts).forEach(d => { counts[d] += (l.split(d).length - 1); });
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      };

      const delim = detectDelimiter(allLines);
      const parsed = allLines.map(l => l.split(delim).map(c => c.trim()));
      if (parsed.length < 2) { setError('Could not extract tabular data from PDF.'); return; }

      const headers = parsed[0].map(h => String(h));
      const rows = parsed.slice(1).filter(r => r.some(c => c !== ''));
      setRawHeaders(headers);
      setRawRows(rows);

      const autoMap = {};
      headers.forEach((h, i) => {
        const match = PRODUCT_FIELDS.find(f => f.label.toLowerCase() === h.toLowerCase() || f.key.toLowerCase() === h.toLowerCase());
        autoMap[i] = match ? match.key : '__skip';
      });
      setColumnMap(autoMap);
      setStep(STEPS.MAP);
      setError('');
    } catch (err) {
      setError('Could not read PDF. Ensure the PDF contains text (not scanned image).');
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setError('');
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      await parsePDF(file);
    } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
      parseExcelOrCSV(file);
    } else {
      setError('Unsupported file type. Please upload .xlsx, .xls, .csv, or .pdf');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const buildPreview = () => {
    const rowObjs = rawRows.map(row => {
      const obj = {};
      Object.entries(columnMap).forEach(([colIdx, field]) => {
        if (field !== '__skip') {
          obj[field] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
        }
      });
      return obj;
    });
    setPreview(rowObjs);
    setStep(STEPS.PREVIEW);
  };

  const validateMap = () => {
    const mappedFields = Object.values(columnMap);
    const missing = REQUIRED_FIELDS.filter(f => !mappedFields.includes(f));
    if (missing.length > 0) {
      setError(`Please map the required columns: ${missing.join(', ')}`);
      return false;
    }
    setError('');
    return true;
  };

  const handleImport = async () => {
    setLoading(true);
    let success = 0, failed = 0, errors = [];
    for (const row of preview) {
      try {
        const payload = {
          name: row.name,
          category: row.category,
          price: parseFloat(row.price) || 0,
          cost: parseFloat(row.cost) || 0,
          stock: parseFloat(row.stock) || 0,
          unit: row.unit || 'Unit',
          stockAlert: parseFloat(row.stockAlert) || 0,
        };
        if (row.barcode) payload.barcode = row.barcode;
        await axios.post(`${API}/products`, payload);
        success++;
      } catch (err) {
        failed++;
        errors.push(`"${row.name}": ${err.response?.data?.message || err.message}`);
      }
    }
    setResult({ success, failed, errors });
    setStep(STEPS.RESULT);
    setLoading(false);
    if (success > 0) onImported();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { reset(); onClose(); }}
      title="Import Products"
    >
      {/* ── STEP 1: Upload ── */}
      {step === STEPS.UPLOAD && (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-[#1c3eb2] hover:bg-blue-50 transition-colors"
          >
            <Upload size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-base font-medium text-gray-600">Drag & drop a file here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supports .xlsx, .xls, .csv, .pdf</p>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />

          <div className="flex gap-4 mt-5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><FileSpreadsheet size={16} className="text-green-500" />Excel / CSV</div>
            <div className="flex items-center gap-1.5"><FileType size={16} className="text-red-500" />PDF (text-based)</div>
            <div className="flex items-center gap-1.5"><FileText size={16} className="text-blue-400" />Any tabular format</div>
          </div>
          {error && <p className="text-sm text-red-500 mt-3 font-medium">{error}</p>}
        </div>
      )}

      {/* ── STEP 2: Map Columns ── */}
      {step === STEPS.MAP && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            File: <span className="font-semibold text-gray-700">{fileName}</span> — {rawRows.length} rows detected. 
            Map each column to a product field.
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {rawHeaders.map((header, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-lg truncate">{header}</div>
                <span className="text-gray-400">→</span>
                <select
                  value={columnMap[i] || '__skip'}
                  onChange={e => setColumnMap({ ...columnMap, [i]: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3eb2]"
                >
                  {PRODUCT_FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>
              </div>
            ))}
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <div className="flex justify-between gap-3 mt-5">
            <Button variant="ghost" onClick={reset}>← Back</Button>
            <Button onClick={() => { if (validateMap()) buildPreview(); }}>Preview →</Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview ── */}
      {step === STEPS.PREVIEW && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{preview.length} products ready to import. Review below:</p>
          <div className="overflow-x-auto max-h-64 rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {PRODUCT_FIELDS.filter(f => f.key !== '__skip' && Object.values(columnMap).includes(f.key)).map(f => (
                    <th key={f.key} className="px-3 py-2 font-semibold text-gray-500 uppercase tracking-wider">{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.slice(0, 20).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {PRODUCT_FIELDS.filter(f => f.key !== '__skip' && Object.values(columnMap).includes(f.key)).map(f => (
                      <td key={f.key} className="px-3 py-2 text-gray-700 whitespace-nowrap">{row[f.key] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 20 && <p className="text-xs text-gray-400 mt-2 text-center">Showing first 20 of {preview.length} rows</p>}

          <div className="flex justify-between gap-3 mt-5">
            <Button variant="ghost" onClick={() => setStep(STEPS.MAP)}>← Back</Button>
            <Button onClick={handleImport} disabled={loading}>
              {loading ? 'Importing...' : `Import ${preview.length} Products`}
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Result ── */}
      {step === STEPS.RESULT && result && (
        <div className="text-center">
          {result.success > 0 && (
            <div className="flex flex-col items-center mb-4">
              <CheckCircle2 size={48} className="text-green-500 mb-3" />
              <p className="text-xl font-bold text-gray-800">{result.success} Products Imported!</p>
            </div>
          )}
          {result.failed > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-2 justify-center">
                <AlertTriangle size={18} /> {result.failed} Failed
              </div>
              <div className="text-left bg-red-50 rounded-xl p-3 max-h-32 overflow-y-auto">
                {result.errors.map((e, i) => <p key={i} className="text-xs text-red-600 mb-1">{e}</p>)}
              </div>
            </div>
          )}
          <Button className="mt-6 w-full" onClick={() => { reset(); onClose(); }}>Done</Button>
        </div>
      )}
    </Modal>
  );
};

export default ImportProductsModal;
