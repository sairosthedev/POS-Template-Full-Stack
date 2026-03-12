import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ExternalLink, ShieldQuestion, BookOpen, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Support = () => {
  const supportChannels = [
    {
      title: 'Email Support',
      desc: 'Send us a detailed message and we will get back to you within 24 hours.',
      icon: <Mail className="text-blue-500" />,
      contact: 'support@miccspos.co.zw',
      action: 'Send Email'
    },
    {
      title: 'WhatsApp Help',
      desc: 'Quick chat for technical issues or simple questions about the system.',
      icon: <MessageSquare className="text-green-500" />,
      contact: '+263 77 123 4567',
      action: 'Start Chat'
    },
    {
      title: 'Call Center',
      desc: 'Emergency support for billing or critical system failures.',
      icon: <Phone className="text-orange-500" />,
      contact: '+263 242 789 000',
      action: 'Call Now'
    }
  ];

  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to People Management, edit your user profile, and enter a new password in the password field.' },
    { q: 'Can I import products from Excel?', a: 'Yes! Go to the Products page and click "Import Products" to upload an Excel, CSV, or PDF file.' },
    { q: 'How do I add a new branch?', a: 'Go to Store Management and click the "Add Branch" button.' },
    { q: 'Can I track inventory levels?', a: 'Yes, the Inventory Management page shows real-time stock levels and low-stock alerts.' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Help & Support</h1>
        <p className="text-gray-500">Need help with Miccs POS? We're here to assist you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {supportChannels.map((channel, i) => (
          <Card key={i} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
              {channel.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{channel.title}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-grow">{channel.desc}</p>
            <div className="mt-auto">
              <p className="text-sm font-semibold text-gray-700 mb-4">{channel.contact}</p>
              <Button variant="outline" className="w-full">{channel.action}</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-2 mb-6 text-[#1c3eb2]">
              <ShieldQuestion size={22} />
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-base font-bold text-gray-800 mb-2">{faq.q}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1c3eb2] text-white">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} />
              <h2 className="text-lg font-bold">User Guide</h2>
            </div>
            <p className="text-sm text-blue-100 mb-6">
              Download our comprehensive User Manual to learn every feature of the Miccs POS system.
            </p>
            <Button className="w-full bg-white text-[#1c3eb2] hover:bg-blue-50 border-0">
              <ExternalLink size={16} className="mr-2" /> Download Manual
            </Button>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4 text-[#1c3eb2]">
              <Clock size={20} />
              <h2 className="text-lg font-bold">Support Hours</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Monday - Friday</span>
                <span className="font-semibold text-gray-700">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Saturday</span>
                <span className="font-semibold text-gray-700">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sunday</span>
                <span className="font-semibold text-orange-500">Emergency Only</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
