const fs = require('fs');
const alumna = require('@alumna/reflect');
const path = require('path');
const { ipcRenderer } = require('electron');

let ulista = document.querySelector('#pastasSelecionadas');
let divSelecao = document.querySelector('#selecao');
let log = document.querySelector('#txtLog>p');

let pastas = [];
let destino = '';

function addPasta() {
  ipcRenderer.send('source:select');
}

ipcRenderer.on('source:selected', (e, data) => {
  data.forEach((pasta) => {
    pastas.push(pasta);
  });
  exibirOrigens();
});

function exibirOrigens() {
  ulista.innerHTML = '';

  if (pastas.length > 0) {
    divSelecao.style.display = 'inline';

    pastas.forEach((pasta) => {
      let item = document.createElement('option');
      item.innerHTML = pasta;
      ulista.append(item);
    });
  } else {
    divSelecao.style.display = 'none';
  }
}

function copiar() {
  log.innerHTML = '';
  incluirLog('*** Backup Iniciado ***');
  pastas.forEach((pasta) => {
    fazerBackup(pasta);
  });
}

function incluirLog(texto) {
  log.innerText += texto + '\n';
}

async function fazerBackup(folderName) {
  let rootFolder = folderName.replace('\\', '/').split('/').pop();
  let destinoComRoot = path.join(destino, rootFolder);

  fs.mkdirSync(destinoComRoot, { recursive: true }, (err) => {
    if (err) throw err;
  });

  let { res, err } = await alumna({
    src: folderName,

    dest: destinoComRoot,

    // (OPTIONAL) Default to 'true'
    recursive: true,

    // (OPTIONAL) Default to 'true'
    // Delete in dest the non-existent files in src
    delete: false,

    // (OPTIONAL) Array with files and folders not to reflect
    // exclude: ['skip-this-file.txt', 'skip/this/directory'],
  });

  if (err) incluirLog(err);
  else
    incluirLog(
      res.replace('Directory', 'Pasta').replace('reflected to', 'copiada para'),
    );
}

function remover() {
  pastas.splice(ulista.selectedIndex, 1);
  exibirOrigens();
}

function carregar() {
  fs.readFile('./config/sources.json', 'utf8', (err, data) => {
    if (err) throw err;
    let lido = JSON.parse(data);
    pastas = lido.sources;
    destino = lido.destination;
    exibirOrigens();
    exibirDestino();
  });
}

function salvar() {
  let obj = { sources: pastas, destination: destino };
  let json = JSON.stringify(obj);
  fs.writeFile('./config/sources.json', json, (err) => {
    if (err) throw err;
    alert('Configuração salva!');
  });
}

function escDestino() {
  ipcRenderer.send('destination:select');
}

ipcRenderer.on('destination:selected', (e, data) => {
  destino = data[0];
  exibirDestino();
});

function exibirDestino() {
  let spanDestino = document.querySelector('#destino');
  spanDestino.innerText = destino;
}
