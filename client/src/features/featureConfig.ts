import AlgorithmCard from './algorithms/components/AlgorithmCard';
//Impoer mmore here
import { useAlgorithms } from './algorithms/hooks/useAlgorithms';
export const FEATURE_REGISTRY: Record<string, any> = {
  algorithm: {
    Component: AlgorithmCard,
    useHook: useAlgorithms,
  }
  // Khi có thêm 'web' hay 'project', bạn chỉ cần thêm 1 dòng ở đây
};