export function conversor(duration:number){
    const horas = Math.floor(duration/3600);
    const minutos = Math.floor((duration % 3600) / 60);
    const segundos = duration % 60;

    const resultado = [horas, minutos, segundos].map(unit=>String(unit).padStart(2,'0')).join(':');

    return resultado;
}