import fs from 'fs';
import path from 'path';

// Helper to read data from the JSON file
const getData = () => {
  try {
    const filePath = path.join(process.cwd(), 'readers24-data/site-data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading news-data.json:', error);
    return {};
  }
};

const data = getData();

export const heroArticle = data.heroArticle || {};
export const secondaryArticles = data.secondaryArticles || [];
export const opinionPieces = data.opinionPieces || [];
export const mostRead = data.mostRead || [];
export const editorsPicks = data.editorsPicks || [];
export const multimediaArticles = data.multimediaArticles || [];
