'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      router.push('/admin-login');
      return;
    }
    fetchData();
  }, [activeTab, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [questionsRes, usersRes, resultsRes] = await Promise.all([
          fetch('/api/questions'),
          fetch('/api/admin/users'),
          fetch('/api/quiz-results')
        ]);
        const questionsData = await questionsRes.json();
        const usersData = await usersRes.json();
        const resultsData = await resultsRes.json();
        
        setQuestions(questionsData);
        setUsers(usersData);
        setResults(resultsData);
        setStats({
          totalUsers: usersData.length || 0,
          totalQuestions: questionsData.length || 0,
          totalAttempts: resultsData.length || 0,
          avgScore: resultsData.length > 0 ? (resultsData.reduce((sum, r) => sum + r.score, 0) / resultsData.length).toFixed(1) : 0
        });
      } else if (activeTab === 'users') {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        setUsers(data);
      } else if (activeTab === 'questions') {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
      } else if (activeTab === 'results') {
        const response = await fetch('/api/quiz-results');
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/questions?id=${editingItem._id}` : `/api/questions`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
        fetchData();
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this question?')) {
      try {
        await fetch(`/api/questions?id=${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteResult = async (id) => {
    if (confirm('Delete this result?')) {
      try {
        await fetch(`/api/quiz-results?id=${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-blue-100 text-sm">Manage Questions, Users & Results</p>
            </div>
            <button onClick={() => { localStorage.removeItem('admin'); router.push('/'); }} className="bg-white/20 px-4 py-2 rounded-lg text-sm">Logout</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {['dashboard', 'results', 'users', 'questions'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowForm(false); }}
                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'results' && `📋 Results (${results.length})`}
                {tab === 'users' && `👥 Users (${users.length})`}
                {tab === 'questions' && `❓ Questions (${questions.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex justify-between items-center">
                  <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p></div>
                  <span className="text-3xl">👥</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex justify-between items-center">
                  <div><p className="text-gray-500 text-sm">Total Questions</p><p className="text-3xl font-bold text-green-600">{stats.totalQuestions}</p></div>
                  <span className="text-3xl">❓</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex justify-between items-center">
                  <div><p className="text-gray-500 text-sm">Quiz Attempts</p><p className="text-3xl font-bold text-orange-600">{stats.totalAttempts}</p></div>
                  <span className="text-3xl">📝</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex justify-between items-center">
                  <div><p className="text-gray-500 text-sm">Avg Score</p><p className="text-3xl font-bold text-purple-600">{stats.avgScore}</p></div>
                  <span className="text-3xl">🎯</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setActiveTab('questions'); setShowForm(true); }} className="bg-blue-50 text-blue-600 p-3 rounded-lg text-left hover:bg-blue-100">➕ Add Question</button>
                <button onClick={() => setActiveTab('results')} className="bg-green-50 text-green-600 p-3 rounded-lg text-left hover:bg-green-100">📊 View Results</button>
                <button onClick={() => setActiveTab('users')} className="bg-purple-50 text-purple-600 p-3 rounded-lg text-left hover:bg-purple-100">👥 Manage Users</button>
                <Link href="/quiz" className="bg-orange-50 text-orange-600 p-3 rounded-lg text-left hover:bg-orange-100">🎯 Take Quiz</Link>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Instagram ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Correct</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, idx) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-blue-500'}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{result.userName}</p>
                          <p className="text-xs text-gray-500">{result.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">@{result.instagramId}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-blue-600">{result.score}</span>
                        <span className="text-xs text-gray-500">/{result.totalQuestions}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">{result.correctCount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{result.timeFormatted}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(result.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => handleDeleteResult(result.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.length === 0 && (
                <div className="p-8 text-center text-gray-500">No quiz results yet</div>
              )}
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Instagram ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Quizzes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={user.profileImage} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">@{user.instagramId}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-600">{user.score || 0}</td>
                      <td className="px-4 py-3 text-sm">{user.totalQuizzesTaken || 0}</td>
                      <td className="px-4 py-3 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Questions */}
        {activeTab === 'questions' && (
          <div>
            <button onClick={() => { setShowForm(true); setEditingItem(null); setFormData({}); }} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">+ Add Question</button>

            {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Question</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-2">Question</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.question || ''} onChange={(e) => setFormData({ ...formData, question: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium mb-2">Option A</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[0] || ''} onChange={(e) => setFormData({ ...formData, options: [e.target.value, formData.options?.[1] || '', formData.options?.[2] || '', formData.options?.[3] || ''] })} /></div>
                    <div><label className="block text-sm font-medium mb-2">Option B</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[1] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', e.target.value, formData.options?.[2] || '', formData.options?.[3] || ''] })} /></div>
                    <div><label className="block text-sm font-medium mb-2">Option C</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[2] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', formData.options?.[1] || '', e.target.value, formData.options?.[3] || ''] })} /></div>
                    <div><label className="block text-sm font-medium mb-2">Option D</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[3] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', formData.options?.[1] || '', formData.options?.[2] || '', e.target.value] })} /></div>
                    <div><label className="block text-sm font-medium mb-2">Correct Answer</label><input required className="w-full p-2 border rounded-lg" value={formData.answer || ''} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium mb-2">Category</label><select className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option>Karnataka GK</option><option>Karnataka History</option><option>Karnataka Geography</option><option>General</option></select></div>
                    <div className="flex gap-3 pt-4"><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button><button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
                  </form>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{idx+1}. {q.question}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                        <div>A) {q.options?.[0]}</div><div>B) {q.options?.[1]}</div>
                        <div>C) {q.options?.[2]}</div><div>D) {q.options?.[3]}</div>
                      </div>
                      <p className="text-sm text-green-600 mt-2">✓ Answer: {q.answer}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => { setEditingItem(q); setFormData(q); setShowForm(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                      <button onClick={() => handleDelete(q._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
