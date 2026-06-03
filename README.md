# Cara install

* clone branch ini
* pastikan menginstall python antara versi 3.10 sampe 3.13
* membuat env yang disesuai dengan database :
  ```
  PGUSER= // nama user anda (biasanya untuk root 'postgres')
  PGHOST=localhost
  PGPASSWORD= // password postgres
  PGDATABASE= // nama database
  PGPORT=5432
  ```
* tambahkan juga URL AI service di .env :
  ```
  AI_SERVICE_URL=http://127.0.0.1:8000/predict
  ```
* di dalam folder backend jalankan perintah :
  ```
  npm install
  ```
* jalankan perintah untuk membuat tabel users:
  ```
  npm run migrate up
  ```
* jalankan server backend dengan perintah :
  ```
  npm run dev
  ```
* selanjutnya di dalam folder ai-service jalankan :
  ```
  python -m venv venv
  .\venv\Scripts\activate
  ```
  (Setelah aktif, di terminalmu akan muncul tanda (venv) di sebelah kiri).
* lalu install library
  ```
  pip install fastapi uvicorn tensorflow joblib scikit-learn pydantic
  ```
* terakhir jalankan server python
  ```
  uvicorn app:app --host 127.0.0.1 --port 8000 --reload
  ```

  # cara simulasi backend
  * import collection dan environment ke postman
  * pastikan server AI dan backend menyala
  * jalankan run collection pada postman
