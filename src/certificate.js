// Emerald Kingdom Rescue Certificate Generator (HTML Canvas)

export function generateCertificate(playerName, score) {
  // Create a high-res canvas (double scale for crisp rendering/printing)
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');

  // Colors
  const darkNavy = '#090d16';
  const emerald = '#10b981';
  const gold = '#fbbf24';
  const cream = '#fef3c7';

  // 1. Background Fill
  ctx.fillStyle = darkNavy;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Inner Frame (Gold Border)
  ctx.strokeStyle = gold;
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // 3. Double Frame (Emerald Border)
  ctx.strokeStyle = emerald;
  ctx.lineWidth = 14;
  ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);
  
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(95, 95, canvas.width - 190, canvas.height - 190);

  // 4. Corner Ornaments (Gold & Emerald Stars/Filigrees)
  drawCornerOrnament(ctx, 95, 95, gold, emerald);
  drawCornerOrnament(ctx, canvas.width - 95, 95, gold, emerald, true, false);
  drawCornerOrnament(ctx, 95, canvas.height - 95, gold, emerald, false, true);
  drawCornerOrnament(ctx, canvas.width - 95, canvas.height - 95, gold, emerald, true, true);

  // 5. Title / Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Ribbon/Banner behind header
  ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
  ctx.fillRect(200, 150, canvas.width - 400, 120);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(200, 150, canvas.width - 400, 120);

  ctx.fillStyle = gold;
  ctx.font = 'bold 50px "Cinzel", "Playfair Display", "Georgia", serif';
  ctx.fillText("ZÜMRÜT KRALLIĞI", canvas.width / 2, 190);
  
  ctx.fillStyle = cream;
  ctx.font = 'letter-spacing: 0.1em; 28px "Montserrat", "Arial", sans-serif';
  ctx.fillText("KAHRAMANLIK VE MATEMATİK BAŞARI SERTİFİKASI", canvas.width / 2, 240);

  // 6. Certificate Text
  ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
  ctx.font = 'italic 28px "Georgia", serif';
  ctx.fillText("Bu onurlu belge, Lugubriya Krallığı'nın karanlık zindanlarını aşarak", canvas.width / 2, 400);
  ctx.fillText("Kral Recher'in kurduğu zorlu matematik bilmecelerini çözen,", canvas.width / 2, 450);
  
  // 7. Player Name (Large & Elegant)
  ctx.fillStyle = gold;
  ctx.font = 'bold 75px "Playfair Display", "Times New Roman", serif';
  // Highlight name with an underline glow
  ctx.fillText(playerName.toUpperCase(), canvas.width / 2, 570);
  
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 350, 620);
  ctx.lineTo(canvas.width / 2 + 350, 620);
  ctx.stroke();

  // 8. Description continued
  ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
  ctx.font = 'italic 28px "Georgia", serif';
  ctx.fillText("ve üstün problem çözme yeteneğiyle Zümrüt Kraliçe Jayden'ı kurtaran,", canvas.width / 2, 690);
  ctx.fillText("krallığın en cesur matematik kaşifine takdim edilmiştir.", canvas.width / 2, 740);

  // 9. Pencil Energy Score
  ctx.fillStyle = emerald;
  ctx.font = 'bold 32px "Montserrat", sans-serif';
  ctx.fillText(`Kalan Sihirli Kalem Enerjisi: %${score}`, canvas.width / 2, 830);

  // 10. Date and Signatures
  // Left: Date
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
  ctx.font = '24px "Montserrat", sans-serif';
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillText(`Tarih: ${today}`, 200, 960);
  
  // Right: Signature of Queen
  ctx.textAlign = 'right';
  ctx.fillText("Sertifikayı Onaylayan:", canvas.width - 200, 930);
  
  ctx.fillStyle = gold;
  ctx.font = 'bold 36px "Brush Script MT", "Caveat", "Playfair Display", italic, serif';
  ctx.fillText("Kraliçe Jayden", canvas.width - 200, 980);
  
  ctx.fillStyle = 'rgba(254, 243, 199, 0.5)';
  ctx.font = '18px "Montserrat", sans-serif';
  ctx.fillText("İdilya Kraliçesi", canvas.width - 200, 1010);

  // Center Signature of the team
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
  ctx.font = '24px "Montserrat", sans-serif';
  ctx.fillText("Kurtarma Ekibi Arkadaşları:", canvas.width / 2, 930);
  ctx.fillStyle = cream;
  ctx.font = '26px "Georgia", serif';
  ctx.fillText("Aleks, Sam & Vanessa", canvas.width / 2, 975);

  // 11. Trigger Download
  const link = document.createElement('a');
  link.download = `kraliceyi-kurtarmak-sertifika-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function drawCornerOrnament(ctx, x, y, goldColor, emeraldColor, flipX = false, flipY = false) {
  ctx.save();
  ctx.translate(x, y);
  
  // Apply flips
  const sx = flipX ? -1 : 1;
  const sy = flipY ? -1 : 1;
  ctx.scale(sx, sy);

  // Draw corner triangles/fans
  ctx.fillStyle = emeraldColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(80, 0);
  ctx.quadraticCurveTo(30, 30, 0, 80);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(110, 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 110);
  ctx.stroke();

  // Little star at vertex
  ctx.fillStyle = goldColor;
  ctx.beginPath();
  ctx.arc(35, 35, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
