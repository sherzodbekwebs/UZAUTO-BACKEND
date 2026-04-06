export class CreateNewsDto {
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descUz: string;
    descRu: string;
    descEn: string;
    contentUz: string;
    contentRu: string;
    contentEn: string;
    date: string;
    image?: string | null; // Mana shu qator borligiga ishonch hosil qiling
}