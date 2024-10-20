export class Invoice {
    public id?: number;
    public installationId: number;
    public numero?: string;
    public serie?: string;
    public dataEmissao?: Date;
    public chaveAcesso?: string;
    public protocoloAutorizacao?: string;

    constructor({
        id,
        installationId,
        numero,
        serie,
        dataEmissao,
        chaveAcesso,
        protocoloAutorizacao
    }: {
        id?: number;
        installationId: number;
        numero?: string;
        serie?: string;
        dataEmissao?: Date;
        chaveAcesso?: string;
        protocoloAutorizacao?: string;
    }) {
        this.id = id;
        this.installationId = installationId;
        this.numero = numero;
        this.serie = serie;
        this.dataEmissao = dataEmissao;
        this.chaveAcesso = chaveAcesso;
        this.protocoloAutorizacao = protocoloAutorizacao;
    }
}
