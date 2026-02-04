export interface Algorithm {
  _id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  coreConcept: string;
  complexity: {
    time: string;
    space: string;
  };
}