import  express from 'express'
//import cors from 'cors'
//import bcrypt from "bcrypt"
import valideUsuario from './middlewares/valideUsuario';

const app = express();
const port=8080;
app.use(express.json());

app.get('/', (req, res) => {
return res.json('OK');
});

app.listen(8080, () => console.log("Servidor iniciado"));



let nextId=1;
const usuarios = [];
const recados = [];



//-------CRIAR CONTA------
app.post('/criar-conta',  (req, res) => {
    const { nome, email, senha } = req.body;
  
    // Verificar se o e-mail já está em uso
    const usuarioExistente = usuarios.find((usuario) => usuario.email === email);
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já em uso' });
    }
  
    // Criar novo usuário
    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
    };
  
    usuarios.push(novoUsuario);
    return res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });
  });
  
  ////----------------------------------------LOGIN-------------------------

  app.post('/login',valideUsuario,(req, res) => {
    const { email, senha } = req.body;
  
    // Verificar se o usuário existe
    const usuario = usuarios.find((usuario) => usuario.email === email);
  
    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
  
    return res.status(200).json({ mensagem: 'Login bem-sucedido', usuario });
  });

// CRUD => CREATE (POST) | READ (GET) | UPDATE (PUT) | DELETE (DEL)

app.post("/recados/:email", (req, res) => {
  const novoRecado = req.body;
  const emailUsuario = req.params.email;
  
  const usuario = usuarios.find((user) => user.email === emailUsuario);

  if (!usuario===-1) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

   
  recados.push({
    id: recados.length + 1,
    titulo: novoRecado.titulo,
    descricao: novoRecado.descricao,
    
  });
return res.status(201).json({
    mensagem: "Recado criado com sucesso",
    recado: novoRecado,
  });
});

// ============ler recado (GET)========
app.get("/recados/:email",(req,res)=>{
  const recadoId = Number (req.params.recadoId);
// Encontrar o recado pelo ID
const recado = recados.find(recado => recado.id === recadoId);

if (!recado.length===0) {
  return res.status(404).json({ mensagem: 'Recado não encontrado' });
}

return res.status(200).json(recado.email);
}
)



//-----------------------------UPDATE (PUT)ATUALIZAR O RECADO---------------------

app.put('/recados/:recadoId', (req, res) => {
  const recadoId = parseInt(req.params.recadoId);
  const { titulo, descricao } = req.body;

  // Encontrar o índice do recado na lista
  const index = recados.findIndex(recado => recado.id === recadoId);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Recado não encontrado' });
  }

  // Atualizar os dados do recado
  recados[index].titulo = titulo;
  recados[index].descricao = descricao;

  return res.status(200).json({ mensagem: 'Recado atualizado com sucesso', recado: recados[index] });
});

//-------------------------DELETE (DEL) PEGAR UM RECADO E DELETAR---------------
app.delete('/recados/:recadoId', (req, res) => {
  const recadoId = parseInt(req.params.recadoId);

  // Encontrar o índice do recado na lista
  const index = recados.findIndex(recado => recado.id === recadoId);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Recado não encontrado' });
  }

  // Remover o recado da lista
  const recadoRemovido = recados.splice(index, 1)[0];

  return res.status(200).json({ mensagem: 'Recado deletado com sucesso', recado: recadoRemovido });
});