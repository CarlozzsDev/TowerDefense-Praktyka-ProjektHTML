const KOLORY_ZASTEPCZE = {
  0: "#3a7d44", // trawa
  1: "#c2b280", // ścieżka
  2: "#6c757d", // miejsce na wieżyczkę
  3: "#2b9348", // start
  4: "#d90429"  // baza
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.hoveredTile = null;
  }

  RozmiarDoMapy(map) {
    this.canvas.width = map.grid[0].length * map.RozmiarMap;
    this.canvas.height = map.grid.length * map.RozmiarMap;
  }

  RysujMape(map) {
    const size = map.RozmiarMap;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < map.grid.length; y++) {
      for (let x = 0; x < map.grid[y].length; x++) {
        const typ = map.grid[y][x];
        const texSrc = map.textureGrid[y][x];
        const img = texSrc ? map.loadedImages[texSrc] : null;

        if (img) {
          this.ctx.drawImage(img, x * size, y * size, size, size);
        } else {
          this.ctx.fillStyle = KOLORY_ZASTEPCZE[typ] || "#000";
          this.ctx.fillRect(x * size, y * size, size, size);
        }

        // Podświetlenie pola budowy po najechaniu myszką
        if (
          this.hoveredTile &&
          this.hoveredTile.x === x &&
          this.hoveredTile.y === y &&
          typ === 2
        ) {
          this.ctx.strokeStyle = "#ffd700";
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(x * size + 1.5, y * size + 1.5, size - 3, size - 3);
        }
      }
    }
  }
}