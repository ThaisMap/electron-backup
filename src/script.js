const fs = require('fs');
const alumna = require('@alumna/reflect');

let ulista = document.querySelector('#pastasSelecionadas');
let divSelecao = document.querySelector('#selecao');

divSelecao.style.display = 'none';
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
        exibirNaTela();
      }
    }
  });
}

function exibirNaTela() {
  ulista.innerHTML = '';
  divSelecao.style.display = 'inline';

  pastas.forEach((pasta) => {
    let item = document.createElement('option');
    item.innerHTML = pasta;
    ulista.append(item);
  });
}

function copiar() {
  pastas.forEach((pasta) => {
    console.log(`copiando pasta ${pasta}`);
    fazerBackup(pasta);
  });
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

  if (err) console.error(err);
  else console.log(res); // Directory "src/" reflected to "dest/"
}

function remover() {
  pastas.delete(ulista.value);
  exibirNaTela();
}
