'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push({ ...formData, date: new Date().toISOString() });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">Have questions? We'd love to hear from you!</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">📍 Address</h3>
            <p className="text-gray-600 mb-4">Bangalore, Karnataka, India</p>
            <h3 className="font-semibold text-gray-800 mb-2">📧 Email</h3>
            <p className="text-gray-600 mb-4">support@kannadaexampro.com</p>
            <h3 className="font-semibold text-gray-800 mb-2">📱 Instagram</h3>
            <p className="text-gray-600">@kannada_exam_pro</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <textarea rows="4" placeholder="Your Message" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Send Message</button>
            {submitted && <p className="text-green-600 text-sm text-center">✓ Message sent successfully!</p>}
          </form>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-blue-600 hover:text-blue-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
