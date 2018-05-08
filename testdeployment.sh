pwd
echo ">>>>>> building for test >>>>>>>>"
ng build -env=test
firebase use membership-du-test
firebase deploy

