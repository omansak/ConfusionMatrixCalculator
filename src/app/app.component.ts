import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'osk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  public matrixSize: number;
  public matrix: Array<Array<number>>;
  public messages: Array<string>;
  public counter = Array;
  ngOnInit(): void {
    //Defaults
    this.matrixSize = 3;
    this.createConfusionMatrix();
    this.matrix = [
      [7, 8, 9],
      [1, 2, 3],
      [3, 2, 1],
    ];
    this.calculateAccuracyValues();
  }

  createConfusionMatrix() {
    if (!this.matrixSize) {
      this.matrixSize = 1;
    }
    this.initConfusionMatrix(this.matrixSize);
  }

  initConfusionMatrix(size: number) {
    this.messages = null;
    this.matrix = Array.from(Array(size), () => Array.from(Array(size)));
  }

  calculateAccuracyValues() {
    let messages = new Array<string>();
    let allTp: number = 0;
    let allFp: number = 0;
    let allTn: number = 0;
    let allFn: number = 0;
    let allPrecision: number = 0;
    let allRecall: number = 0;
    let microF1: number = 0;
    let totalPrecision: number = 0;
    let totalRecall: number = 0;
    let totalFMeasure: number = 0;

    for (let i = 0; i < this.matrixSize; i++) {
      let tp = this.calculateTruePosition(i);
      let tn = this.calculateTrueNegative(i);
      let fp = this.calculateFalsePositive(i);
      let fn = this.calculateFalseNegative(i);
      let accuracy = this.calculateAccuracy(tp, tn, fp, fn);
      let misclassification = this.calculateMisclassification(tp, tn, fp, fn);
      let precision = this.calculatePrecision(tp, tn, fp, fn);
      let recall = this.calculateRecall(tp, tn, fp, fn);
      let specifity = this.calculateSpecifity(tp, tn, fp, fn);
      let fMeasure = this.calculateFMeasure(precision, recall);

      allTp += tp;
      allFp += fp;
      allTn += tn;
      allFn += fn;
      totalPrecision += precision;
      totalRecall += recall;
      totalFMeasure += fMeasure;

      messages.push(`------------ STAT FOR #${i} ------------ `);
      messages.push(`True Positive : ${tp}`);
      messages.push(`True Negative : ${tn}`);
      messages.push(`False Positive : ${fp}`);
      messages.push(`False Negative : ${fn}`);
      messages.push(`Accuracy : ${accuracy}`);
      messages.push(`Misclassification Rate : ${misclassification}`);
      messages.push(`Precision : ${precision}`);
      messages.push(`Recall : ${recall}`);
      messages.push(`Specifity : ${specifity}`);
      messages.push(`FMeasure : ${fMeasure}`);
    }
    messages.push(`------------ STAT FOR ALL ------------ `);
    allPrecision = this.calculatePrecision(allTp, allTn, allFp, allFn);
    allRecall = this.calculateRecall(allTp, allTn, allFp, allFn);
    microF1 = this.calculateFMeasure(allPrecision, allRecall);
    messages.push(`All True Positive : ${allTp}`);
    messages.push(`All True Negative : ${allTn}`);
    messages.push(`All False Positive : ${allFp}`);
    messages.push(`All False Negative : ${allFn}`);
    messages.push(`All Precision : ${allPrecision}`);
    messages.push(`All Recall : ${allRecall}`);
    messages.push(`Total Precision : ${totalPrecision}`);
    messages.push(`Total Recall : ${totalRecall}`);
    messages.push(`Total FMeasure : ${totalFMeasure}`);
    messages.push(`Micro F1 : ${microF1}`);
    messages.push(`Macro F1 : ${(totalFMeasure) / this.matrixSize}`);
    setTimeout(() => this.messages = messages, 32);
  }

  calculateTruePosition(index: number): number {
    return this.matrix[index][index];
  }

  calculateTrueNegative(index: number): number {
    let total: number = 0;
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (j != index && i != index) {
          total += this.matrix[i][j];
        }
      }
    }
    return total;
  }

  calculateFalsePositive(index: number): number {
    let total: number = 0;
    for (let i = 0; i < this.matrixSize; i++) {
      if (i != index) {
        total += this.matrix[index][i];
      }
    }
    return total;
  }

  calculateFalseNegative(index: number): number {
    let total: number = 0;
    for (let i = 0; i < this.matrixSize; i++) {
      if (i != index) {
        total += this.matrix[i][index];
      }
    }
    return total;
  }

  calculateAccuracy(tp: number, tn: number, fp: number, fn: number) {
    return (tp + tn) / (tp + tn + fp + fn);
  }

  calculateMisclassification(tp: number, tn: number, fp: number, fn: number) {
    return (fp + fn) / (tp + tn + fp + fn);
  }

  calculatePrecision(tp: number, tn: number, fp: number, fn: number) {
    return (tp) / (tp + fp);
  }

  calculateRecall(tp: number, tn: number, fp: number, fn: number) {
    return (tp) / (tp + fn);
  }

  calculateSpecifity(tp: number, tn: number, fp: number, fn: number) {
    return (tn) / (tn + fp);
  }

  calculateFMeasure(precision: number, recall: number) {
    return (2 * precision * recall) / (precision + recall);
  }
}
