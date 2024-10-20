export class BillingValue {
    public id?: number;
    public installationId: number;
    public item?: string;
    public unidade?: string;
    public quantidade?: number;
    public precoUnitario?: number;
    public valor?: number;
    public baseCalculo?: number;

    constructor({
        id,
        installationId,
        item,
        unidade,
        quantidade,
        precoUnitario,
        valor,
        baseCalculo
    }: {
        id?: number;
        installationId: number;
        item?: string;
        unidade?: string;
        quantidade?: number;
        precoUnitario?: number;
        valor?: number;
        baseCalculo?: number;
    }) {
        this.id = id;
        this.installationId = installationId;
        this.item = item;
        this.unidade = unidade;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.valor = valor;
        this.baseCalculo = baseCalculo;
    }
}
