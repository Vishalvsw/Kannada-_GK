import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readData(filename) {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

function writeData(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Users - Start empty
export function getUsers() {
  return readData('users.json');
}

export function saveUsers(users) {
  writeData('users.json', users);
}

// Quiz Results - Start empty
export function getQuizResults() {
  return readData('quiz-results.json');
}

export function saveQuizResults(results) {
  writeData('quiz-results.json', results);
}

// Questions - Start empty (NO dummy questions)
export function getQuestions() {
  return readData('questions.json');
}

export function saveQuestions(questions) {
  writeData('questions.json', questions);
}

// Notes - Start empty
export function getNotes() {
  return readData('notes.json');
}

export function saveNotes(notes) {
  writeData('notes.json', notes);
}

// Current Affairs - Start empty
export function getCurrentAffairs() {
  return readData('current-affairs.json');
}

export function saveCurrentAffairs(affairs) {
  writeData('current-affairs.json', affairs);
}
