pwd
echo ">>>>>> building for prod >>>>>>>>"
ng build -env=prod
firebase use membershipdevunited
firebase deploy

