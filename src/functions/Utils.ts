export class Utils {
  public static formatTime(ms: number): string {
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;
    if (ms < minuteMs) return `${ms / 1000}s`;
    if (ms < hourMs)
      return `${Math.floor(ms / minuteMs)}m ${Math.floor(
        (ms % minuteMs) / 1000
      )}s`;
    if (ms < dayMs)
      return `${Math.floor(ms / hourMs)}h ${Math.floor(
        (ms % hourMs) / minuteMs
      )}m`;
    return `${Math.floor(ms / dayMs)}d ${Math.floor((ms % dayMs) / hourMs)}h`;
  }

  public static chunk(array: any[], size: number) {
    const chunked_arr: any[][] = [];
    for (let index = 0; index < array.length; index += size) {
      chunked_arr.push(array.slice(index, size + index));
    }
    return chunked_arr;
  }

  public static formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  public static formatNumber(number: number): string {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  public static parseTime(string: string): number {
    const time = string.match(/([0-9]+[d,h,m,s])/g);
    if (!time) return 0;
    let ms = 0;
    for (const t of time) {
      const unit = t[t.length - 1];
      const amount = Number(t.slice(0, -1));
      if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
      else if (unit === "h") ms += amount * 60 * 60 * 1000;
      else if (unit === "m") ms += amount * 60 * 1000;
      else if (unit === "s") ms += amount * 1000;
    }
    return ms;
  }

  public static progressBar(current: number, total: number, size = 20): string {
    const percent = Math.round((current / total) * 100);
    const filledSize = Math.round((size * current) / total);
    const filledBar = "▓".repeat(filledSize);
    const emptyBar = "░".repeat(size - filledSize);
    return `${filledBar}${emptyBar} ${percent}%`;
  }
}
