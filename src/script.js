const fs = require('fs');
const alumna = require('@alumna/reflect');

let ulista = document.querySelector('#pastasSelecionadas');
let divSelecao = document.querySelector('#selecao');
let log = document.querySelector('#txtLog>p');

let pastas = [];

function addPasta() {
  let input = document.querySelector('input#inputPasta');
  let valor = input.value;

  fs.access(valor, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Pasta nao existe');
    } else {
      if (pastas.indexOf(valor) >= 0) {
        console.error('Pasta repetida');
      } else {
        pastas.push(valor);
        exibirPastas();
      }
    }
  });
}

function exibirPastas() {
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
  let folderToCreate = folderName.split('\\').pop();
  let destino = `./teste/destino/${folderToCreate}`;

  fs.mkdirSync(destino, { recursive: true }, (err) => {
    if (err) throw err;
  });

  let { res, err } = await alumna({
    src: folderName,

    dest: destino,

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
  exibirPastas();
}

function carregar() {
  fs.readFile('./config/sources.json', 'utf8', (err, data) => {
    if (err) throw err;
    pastas = JSON.parse(data).paths;
    exibirPastas();
  });
}

function salvar() {
  let obj = { paths: pastas };
  let json = JSON.stringify(obj);
  fs.writeFile('./config/sources.json', json, (err) => {
    if (err) throw err;
    alert('Configuração de pastas salva!');
  });
}
