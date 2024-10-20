export class TechnicalInfo {
    public id?: number;
    public installationId: number;
    public classe?: string;
    public subclasse?: string;
    public modalidade?: string;
    public leituraAnterior?: string;
    public leituraAtual?: string;
    public dias?: number;
    public consumoEnergia?: number;

    constructor({
        id,
        installationId,
        classe,
        subclasse,
        modalidade,
        leituraAnterior,
        leituraAtual,
        dias,
        consumoEnergia
    }: {
        id?: number;
        installationId: number;
        classe?: string;
        subclasse?: string;
        modalidade?: string;
        leituraAnterior?: string;
        leituraAtual?: string;
        dias?: number;
        consumoEnergia?: number;
    }) {
        this.id = id;
        this.installationId = installationId;
        this.classe = classe;
        this.subclasse = subclasse;
        this.modalidade = modalidade;
        this.leituraAnterior = leituraAnterior;
        this.leituraAtual = leituraAtual;
        this.dias = dias;
        this.consumoEnergia = consumoEnergia;
    }
}
