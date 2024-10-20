export class PaymentInfo {
    public id?: number;
    public installationId: number;
    public codigoDebitoAutomatico?: string;
    public vencimento?: Date;
    public totalPagar?: number;

    constructor({
        id,
        installationId,
        codigoDebitoAutomatico,
        vencimento,
        totalPagar
    }: {
        id?: number;
        installationId: number;
        codigoDebitoAutomatico?: string;
        vencimento?: Date;
        totalPagar?: number;
    }) {
        this.id = id;
        this.installationId = installationId;
        this.codigoDebitoAutomatico = codigoDebitoAutomatico;
        this.vencimento = vencimento;
        this.totalPagar = totalPagar;
    }
}
