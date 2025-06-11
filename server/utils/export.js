const ExcelJS = require('exceljs');
const { Document, Packer, Paragraph, TextRun } = require('docx');

exports.exportToExcel = async (posts) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Posts');

  worksheet.columns = [
    { header: 'Title', key: 'title' },
    { header: 'Content', key: 'content' },
  ];

  posts.forEach(post => {
    worksheet.addRow({ title: post.title, content: post.content });
  });

  return await workbook.xlsx.writeBuffer();
};

exports.exportToWord = async (posts) => {
  const doc = new Document();

  const children = posts.map(post => [
    new Paragraph({ text: post.title, heading: "Heading1" }),
    new Paragraph(post.content),
    new Paragraph(" ")
  ]).flat();

  doc.addSection({ children });

  return await Packer.toBuffer(doc);
};
