class Helpers {
  handleData(data: string) {
    if (data.length < 9) {
      return `0${data}`;
    }
    return data;
  }
}

const helpers = new Helpers();

export default helpers;
