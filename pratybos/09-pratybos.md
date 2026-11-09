# 9 pratybos: realieji integralai reziduumais

## 1. $\displaystyle I=\int_0^{2\pi}e^{\cos\theta}\cos(n\theta-\sin\theta)\,d\theta$

Keitinys $z=e^{i\theta}$, $d\theta=\dfrac{dz}{iz}$:
$e^{\cos\theta}e^{i(n\theta-\sin\theta)}=e^{\cos\theta-i\sin\theta}e^{in\theta}=e^{1/z}z^n$, todėl

$$I=\operatorname{Re}\frac1i\oint_{|z|=1}z^{n-1}e^{1/z}\,dz .$$

$z=0$ yra esminis taškas. $e^{1/z}=\sum_k \dfrac{1}{k!\,z^k}$, koeficientas prie $1/z$ gaunamas iš nario $k=n$: $\operatorname{Res}_{0}=\dfrac1{n!}$.

$$I=\frac1i\cdot2\pi i\cdot\frac1{n!}=\boxed{\frac{2\pi}{n!}}$$

> Pratybose užrašytas „$\frac1{n!}\cdot\frac1z$“ yra Lorano eilutės narys su $1/z$ (t. y. reziduumas), o pats integralas lygus $2\pi/n!$. Skaitiškai: $n=2$ duoda $\pi$.

## 2. $\displaystyle I=\int_0^{2\pi}\frac{\sin^2\theta\,d\theta}{a+b\cos\theta},\quad a>b>0$

$\sin^2\theta=-\dfrac{(z^2-1)^2}{4z^2}$, $a+b\cos\theta=\dfrac{bz^2+2az+b}{2z}$:

$$I=\oint_{|z|=1}\frac{i\,(z^2-1)^2\,dz}{2b\,z^2(z-z_1)(z-z_2)},\qquad z_{1,2}=\frac{-a\pm\sqrt{a^2-b^2}}{b},\ z_1z_2=1.$$

Viduje: $z=0$ (II eilės polius) ir $z_1=\frac{-a+\sqrt{a^2-b^2}}{b}$.
$\operatorname{Res}_0=-\dfrac{ia}{b^2}$, $\operatorname{Res}_{z_1}=\dfrac{i\sqrt{a^2-b^2}}{b^2}$.

$$I=2\pi i\left(\operatorname{Res}_0+\operatorname{Res}_{z_1}\right)=\boxed{\frac{2\pi\left(a-\sqrt{a^2-b^2}\right)}{b^2}}$$

> Pratybose užrašytas „$2\pi^2(a-\sqrt{a^2-b^2})$“ greičiausiai klaidingas: turi būti $\pi$ (ne $\pi^2$) ir dar dalyba iš $b^2$. Patikrinimai: kai $b\to0$, gaunam $\pi/a$ (teisinga); $a=3,\ b=2$ duoda $\approx1{,}2000$, kaip ir skaitinis integralas.

## 3. N.D. $\displaystyle I=\int_{-\infty}^{\infty}\frac{\cos px-\cos qx}{x^2}\,dx,\quad p,q>0$

1. **Kosinusus keičiame eksponentėmis:** $f(z)=\dfrac{e^{ipz}-e^{iqz}}{z^2}$, $I=\operatorname{Re}\,\mathrm{v.p.}\!\int_{-\infty}^{\infty}f(x)\,dx$.
2. **Kuri eksponentė kur gęsta:** $|e^{ipz}|=e^{-py}$. Kai $p>0$ (ir $q>0$) abi eksponentės gęsta viršutinėje pusplokštumėje, todėl kontūrą uždarome viršutiniu pusapskritimiu; pagal Žordano lemą jo integralas $\to0$. Jei $p<0$, $e^{ipz}$ gęstų apatinėje pusplokštumėje; kadangi $\cos$ lyginė, visada galima imti $|p|,|q|$.
3. **Ypatingas taškas** $z=0$ (vardiklis $z^2$) guli ant kontūro. Skaitiklis taške 0 lygus 0, todėl polius iš tikrųjų pirmos eilės:
   $$e^{ipz}-e^{iqz}=i(p-q)z+\frac{q^2-p^2}{2}z^2+\dots\ \Rightarrow\ f(z)=\frac{i(p-q)}{z}+\frac{q^2-p^2}{2}+\dots,\qquad \operatorname{Res}_0=i(p-q).$$
4. **Kontūras:** $[-R,-\varepsilon]$ + mažas viršutinis pusapskritimis aplink 0 + $[\varepsilon,R]$ + didelis pusapskritimis. Viduje ypatingų taškų nėra, todėl suma lygi 0. Mažas pusapskritimis (pagal laikrodžio rodyklę) duoda $-\pi i\operatorname{Res}_0$, taigi polius ant kontūro įneša $\pi i\operatorname{Res}$:
   $$\mathrm{v.p.}\!\int_{-\infty}^{\infty}f(x)\,dx=\pi i\cdot i(p-q)=\pi(q-p).$$
5. Rezultatas realus. Menamoji dalis $\int\frac{\sin px-\sin qx}{x^2}dx$ yra nelyginės funkcijos integralas, lygus 0. Pradinis integrandas taške 0 baigtinis ($\to\frac{q^2-p^2}{2}$), todėl $I$ yra paprastas konverguojantis integralas.

$$\boxed{I=\pi(q-p)}\qquad\text{bendrai } I=\pi\left(|q|-|p|\right).$$

> Skaitiškai: $p=1,\ q=3$ duoda $2\pi\approx6{,}283$.
