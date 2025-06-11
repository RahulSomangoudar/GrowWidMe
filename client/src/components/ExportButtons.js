// src/components/ExportButtons.js
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportButtons = ({ posts }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(posts.map(post => ({
      Title: post.title,
      Content: post.content,
      Author: post.createdBy?.username || 'Anonymous'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "posts.xlsx");
  };

  const exportToWord = () => {
    const content = posts.map(post =>
      `Title: ${post.title}\nContent: ${post.content}\nAuthor: ${post.createdBy?.username || 'Anonymous'}\n\n`
    ).join('');
    const blob = new Blob([content], { type: "application/msword" });
    saveAs(blob, "posts.doc");
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={exportToWord}>Export to Word</button>
    </div>
  );
};

export default ExportButtons;
