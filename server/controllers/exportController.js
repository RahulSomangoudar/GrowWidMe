const Post = require('../models/Post');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const ExcelJS = require('exceljs');

// ✅ Word Export (fixed)
exports.handleExportToWord = async (req, res) => {
    try {
      const posts = await Post.find().populate('createdBy', 'username');
  
      const doc = new Document({
        sections: [
          {
            children: posts.flatMap((post) => [
              new Paragraph({
                children: [new TextRun({ text: `Title: ${post.title}`, bold: true, size: 28 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `By: ${post.createdBy?.username || 'Unknown'}`, italics: true })],
              }),
              new Paragraph(post.content),
              new Paragraph(''), // empty line
            ]),
          },
        ],
      });
  
      const buffer = await Packer.toBuffer(doc);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=posts.docx');
      res.send(buffer);
    } catch (err) {
      console.error('❌ Word Export Error:', err);
      res.status(500).json({ error: 'Failed to export to Word' });
    }
  };

// ✅ Excel Export (already great!)
exports.handleExportToExcel = async (req, res) => {
  try {
    const posts = await Post.find().populate('createdBy', 'username');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Posts');

    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Content', key: 'content', width: 50 },
      { header: 'Author', key: 'author', width: 20 },
    ];

    posts.forEach((post) => {
      worksheet.addRow({
        title: post.title,
        content: post.content,
        author: post.createdBy?.username || 'Unknown',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=posts.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Excel Export Error:', err);
    res.status(500).json({ error: 'Failed to export to Excel' });
  }
};
