const valideUsuario = (req, res, next) => {
  const { email, senha } = req.body;

  // Realize a validação dos dados do usuário aqui
  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  // Chame next() para passar para o próximo middleware ou rota
  next();
};

export default valideUsuario;

