//Criar uma interface para padronizar Employee.
interface IEmployee{
    name: string,
    code: number,
}

const employee: IEmployee = {
    name: 'John',
    code: 10,
}