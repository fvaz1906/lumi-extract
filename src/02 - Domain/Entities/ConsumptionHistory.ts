export class ConsumptionHistory {
    public id?: number;
    public installationId: number;
    public mesAno?: string;
    public consumo?: number;
    public media?: number;
    public dias?: number;

    constructor({
        id,
        installationId,
        mesAno,
        consumo,
        media,
        dias
    }: {
        id?: number;
        installationId: number;
        mesAno?: string;
        consumo?: number;
        media?: number;
        dias?: number;
    }) {
        this.id = id;
        this.installationId = installationId;
        this.mesAno = mesAno;
        this.consumo = consumo;
        this.media = media;
        this.dias = dias;
    }
}
