interface IPessoa {
    nome: string;
    idade: number;
    profissao: "Atriz" | "Padeiro";
  }
  
  const pessoa1: IPessoa = {
    nome: "maria",
    idade: 29,
    profissao: "Atriz",
  };
  
  const pessoa2: IPessoa = {
    nome: "roberto",
    idade: 19,
    profissao: "Padeiro",
  };
  
  const pessoa3: IPessoa = {
    nome: "laura",
    idade: 32,
    profissao: "Atriz",
  };
  
  const pessoa4: IPessoa = {
      nome: "carlos",
      idade: 19,
      profissao: 'Padeiro',
  }