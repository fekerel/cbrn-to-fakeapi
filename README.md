
# Typescript Mocha Baseline API Tests Project

## Kullanılan Teknoloji içerikleri:

1. Nodejs
2. TypeScript
3. Mocha
4. Chai
5. Mochawesome 
6. Allure
7. Axios


## Başlarken
Sistemde yüklü bir Node olması gerekmektedir. (örn node v20)

İlk olarak yarn yüklüyoruz;

```bash
npm install --global yarn
```
ssl hatası alınmaması için
```bash
yarn config set "strict-ssl" false
```
```bash
npm config set "strict-ssl" false
```

bağımlılıkları ekliyoruz.

```bash
yarn install
```

yarn ile hata alınırsa
```bash
npm install
```

## Test Çalıştırma
runner ile 2 Farklı environment'da çalıştırıyoruz.

```bash
yarn run runner --suite=suiteName --environment=DEV

yarn run runner--environment=DEV2
```
#### Tüm parametrelerle örnek
```bash
yarn run runner --widgetSkip=true --environment=DEV3 --suite=suiteName --grep=AIRCRAFT
```
#### Full run
```bash
yarn run runner --widgetSkip=true --environment=DEV 
```
##### widgetSkip
Eğer lokalde widget ayağa kaldırılmamışsa ve docker ile koşulmuyorsa ```--widgetSkip=true``` eklenmelidir.

#### Docker çalıştırma

```bash
Windows:
powershell $env:DOCKER_PARAMS='--environment=DEV --suite=suiteName'; docker compose up --abort-on-container-exit --build

Linux:
DOCKER_PARAMS="--environment=DEV --suite=suiteName" docker compose up --abort-on-container-exit --build
```

## Rapor oluşturma

varsayılan olarak mochawesome kullanıyoruz. Mochawesome paralel çalışmayı desteklemektedir.

#### Mochawesome Sonuçlar
_mochawesome-report\mochawesome.html_ chrome ile açılarak incelenebilir.

#### Allure Sonuçlar
Diğer çözüm olarak Allure kullanabilirsiniz.
Kullanmak isterseniz ``` yarn run runner --reporter=allure ``` şeklinde çalıştırılması gerekiyor.
Allure kullanıldığında raporlar için:


```bash
yarn run report:generate
```

Raporu Browserda açma;

```bash
yarn run report:open
```

hepsi bir arada çözümü;

```bash
yarn run allInOne
```


### Runner İçin Kullanılabilecek Parametreler

|Parametre       |              Değerler            |Anlam                   |
|----------------|-------------------------------|-----------------------------|
|environment|**DEV**,**DEV2**,**DEV3**|Test edilecek ortam|
|reporter |**allure**,**mochawesome**|Sonuçlar için kullanılacak raporlama|
|suite |<_\_\_tests___ klasörü altında bulunan klasör isimleri>|Çalıştırılacak test suiti|
|grep |\<filtrelenecek kelime>|Testleri isme göre filtreleme|
|widgetSkip|**true**,**false**|widget bileşeni kullanılmayacaksa true verilmelidir. Yoksa testler fail edecektir|


## Kod eklerken
Kod commit yapmadan önce package.json içindeki lint çalıştırılmalı ve çıkan tüm hatalar düzeltilmeli.

```bash
yarn run lint
```

Ayıca token.json her çalıştırılmada otomatik değiştirileceği için aşağıdaki kod parçası çalıştırılmalıdır.

```bash
git update-index --assume-unchanged src\testConstants\token.json
```

### PR süreci
1. yapılan işe özgün isim/taskID şeklinde branch açılmalı.
2. kodlar o branch ile pull request açılmalı
3. review sonra kişi kendisi master merge etmelidir.
4. conflict olmaması için lokalde kendi branchin commit yapıldıktan sonra
5. lokaldeki mastera gecilmeli. 
6. remote master pull edilmeli.
7. is yaptıgın branche gecerek güncel master merge edilmelidir.
8. bu işlemde oluşacak conflictler çözülür.


```bash
git checkout -b halit/TESTMD-2025
git add *
git commit -m "readme gucnellendi"
git checkout master
git pull origin master
git checkout halit/TESTMD-2025
git merge master
```
burada olusacak conflictleri çöz

```bash
git push halit/TESTMD-2025
```
PR aç

