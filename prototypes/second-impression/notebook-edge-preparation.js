export async function prepareNotebookEdges(papers) {
  if (!globalThis.Worker) return prepareOnMainThread(papers);
  const worker = new Worker(new URL('./notebook-edge-worker.js',import.meta.url),{ type: 'module' });
  let pending;
  const request = index => {
    const result = new Promise((resolve,reject) => {
      pending = { resolve, reject };
      const paper = papers[index];
      worker.postMessage({ width: 1600, height: Math.round(800 * paper.ratio) * 2,
        seed: paper.seed, factory: paper.factory, widthMm: paper.widthMm });
    });
    // A prefetched reply may fail while the previous recipe is being replayed.
    result.catch(() => {}); return result;
  };
  worker.onmessage = event => { const current = pending; pending = null; current.resolve(event.data); };
  worker.onerror = event => { event.preventDefault(); pending?.reject(new Error(event.message || 'Notebook edges could not prepare')); };
  worker.onmessageerror = () => pending?.reject(new Error('Notebook edge commands could not load'));
  try {
    let next = request(0);
    for (let index = 0; index < papers.length; index++) {
      const recipe = await next;
      if (index + 1 < papers.length) next = request(index + 1);
      const prepared = papers[index].makeTexture(recipe); prepared.width = prepared.height = 1;
      await new Promise(resolve => setTimeout(resolve,0));
    }
  } finally { worker.terminate(); }
}

async function prepareOnMainThread(papers) {
  for (const paper of papers) {
    const prepared = paper.makeTexture(); prepared.width = prepared.height = 1;
    await new Promise(resolve => setTimeout(resolve,0));
  }
}
