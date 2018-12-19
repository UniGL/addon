const int SIZE = 2097152;
float buffer[SIZE], opMatrix[16], res[SIZE];
int offset[1024], curSIZE = 0;

int matMulVec(const int matID, const int matSize, const int opSize) {
  /**
   * handle mat mul vector
   * only support length of 3 and 4 for efficiency
   * other length can also be supported but maybe not efficient
   */
  float* cur_buffer = buffer + offset[matID];
  int cnt = 0;
  for (int i = 0;i < matSize;) {
    for (int j = 0;j < opSize;++ j, ++ i) 
      res[cnt] += cur_buffer[i] * opMatrix[j];
    ++ cnt;
  }
  return cnt;
}

void trans(float* matrix, const int len) {
  /**
   * trans the matrix inplace
   * only support opSize is 9 or 16
   */
  for (int i = 0;i < len;++ i) {
    for (int j = i + 1;j < len;++ j) {
      int tmp = matrix[i * len + j];
      matrix[i * len + j] = matrix[j * len + i];
      matrix[j * len + i] = tmp;
    }
  }
}

int matMulMat(const int matID, const int matSize, const int opSize) {
  /**
   * handle mat mul mat
   * only support length of 9 and 16
   */
  float* cur_buffer = buffer + offset[matID];
  int len = opSize == 9 ? 3 : 4;
  int blockSize = matSize / len, opPtr, cnt = 0;
  trans(opMatrix, len);
  for (int i = 0;i < blockSize;++ i) {
    opPtr = 0;
    int cur_ptr = i * len;
    for (int j = 0;j < len;++ j) {
      res[cnt] = 0;
      for (int k = 0;k < len;++ k) 
        res[cnt] += cur_buffer[cur_ptr + k] * opMatrix[opPtr ++] ;
      ++ cnt;
    }
  }
  return cnt;
}

int matMul(const int matID, const int matSize, const int opSize) {
  /**
   * handle all the mat Mul functions
   * give task to subfunctions based on opSize
   * the mul is the result of buffer ID and opMatrix
   * return the mul result
   */
  if (9 == opSize || 16 == opSize) return matMulMat(matID, matSize, opSize);
  return matMulVec(matID, matSize, opSize);
}

float* loadMatrix(const int matID, const int length) {
  offset[matID] = curSIZE;
  curSIZE += length;
  return (&buffer[offset[matID]]);
}

float* getBufferPtr() {
  return (&buffer[0]);
}
float* getOpMatrixPtr() {
  return (&opMatrix[0]);
}
float* getResPtr() {
  return (&res[0]);
} 

int main() {
  matMulMat(0, 30, 9);
  return 0;
}
