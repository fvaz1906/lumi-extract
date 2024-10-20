export class Installation {
    public id?: number;
    public numeroInstalacao: string;
    public clienteNome?: string;
    public clienteCnpj?: string;
    public clienteIe?: string;
    public clienteEndereco?: object;

    constructor({
        id,
        numeroInstalacao,
        clienteNome,
        clienteCnpj,
        clienteIe,
        clienteEndereco
    }: {
        id?: number;
        numeroInstalacao: string;
        clienteNome?: string;
        clienteCnpj?: string;
        clienteIe?: string;
        clienteEndereco?: object;
    }) {
        this.id = id;
        this.numeroInstalacao = numeroInstalacao;
        this.clienteNome = clienteNome;
        this.clienteCnpj = clienteCnpj;
        this.clienteIe = clienteIe;
        this.clienteEndereco = clienteEndereco;
    }
}
