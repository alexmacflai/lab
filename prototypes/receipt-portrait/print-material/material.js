// One shared material image; camera frames retain their own resolution.
export const transferFilm = new Image();
transferFilm.src = new URL('./transfer-film.png', import.meta.url).href;
await transferFilm.decode();
