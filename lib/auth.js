import { connectToDatabase } from './mongodb';
import User from './models/User';

export async function updateUserScore(email, newScore, totalQuestions) {
  await connectToDatabase();
  
  const user = await User.findOne({ email });
  
  if (user) {
    const percentage = (newScore / totalQuestions) * 100;
    
    // Update user stats
    if (newScore > user.score) {
      user.score = newScore;
    }
    user.totalQuizzesTaken += 1;
    user.correctAnswers += newScore;
    user.wrongAnswers += (totalQuestions - newScore);
    user.updatedAt = new Date();
    
    // Add to quiz history
    user.quizHistory.push({
      quizId: new Date().getTime().toString(),
      score: newScore,
      totalQuestions: totalQuestions,
      percentage: percentage,
      date: new Date()
    });
    
    await user.save();
  }
  
  return user;
}

export async function getUserByEmail(email) {
  await connectToDatabase();
  return await User.findOne({ email });
}

export async function getAllUsers() {
  await connectToDatabase();
  return await User.find({}).sort({ score: -1 }).limit(100);
}

export async function promoteToAdmin(email) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (user && user.role !== 'super_admin') {
    user.role = 'admin';
    await user.save();
  }
  return user;
}

export async function demoteFromAdmin(email) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (user && user.role === 'admin') {
    user.role = 'user';
    await user.save();
  }
  return user;
}

export async function getUserStats(email) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (user) {
    return {
      totalScore: user.score,
      totalQuizzes: user.totalQuizzesTaken,
      correctAnswers: user.correctAnswers,
      wrongAnswers: user.wrongAnswers,
      accuracy: user.correctAnswers + user.wrongAnswers > 0 
        ? ((user.correctAnswers / (user.correctAnswers + user.wrongAnswers)) * 100).toFixed(1)
        : 0,
      quizHistory: user.quizHistory.slice(-10).reverse()
    };
  }
  return null;
}

export function isAdmin(email) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}

export function isSuperAdmin(email) {
  const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];
  return superAdminEmails.includes(email);
}
