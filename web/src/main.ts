type AppState = {
  title: string
  count: number
}

const state: AppState = {
  title: 'Vite + TypeScript',
  count: 0,
}

function render(root: HTMLElement, data: AppState): void {
  root.innerHTML = `
    <h1>${data.title}</h1>
    <button id="counter" type="button">Count is ${data.count}</button>
  `
  const btn = document.querySelector<HTMLButtonElement>('#counter')
  btn?.addEventListener('click', () => {
    data.count++
    render(root, data)
  })
}

const app = document.getElementById('app') as HTMLElement
render(app, state)