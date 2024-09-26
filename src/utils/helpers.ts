class Helpers {
  handleData(data: string) {
    if (data.length < 9) {
      return `0${data}`;
    }
    return data;
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);

    return formattedDate;
  }
}

const helpers = new Helpers();

export default helpers;
