# 4 App de músicas
Requisitos
  - Modelar objeto de bandas
  - Modelar objeto de músicas

[x] Bandas
  [x] Adicionar bandas
  [x] Listar bandas
  [x] Remover bandas
[x] Favoritos
  [x] Listar bandas
  [x] Remover bandas
[x] Listar bandas por gêneros
[] Músicas
  [x] Listar músicas da banda
  [x] Dar "like" na música
  [] Listar quantidade de likes daquela música

*************************************************
Listar bandas por gêneros:
  [POST] Creat Genders:
    Percorrer por cada objeto "banda" dentro do array "bands" e identificar o elemento "gender" (string);
    Com o elemento "gender" identificado, verificar se existe um array em Genders List que contenha no mínimo uma banda com o mesmo "gender";
    Se não existir, criar um array e adicionar a banda nele, senão, adicionar a banda no array equivalente ao "gender";
