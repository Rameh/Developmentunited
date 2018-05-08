pwd
echo ">>>>>> building for uat >>>>>>>>"
ng build -env=uat
firebase use membership-du-uat
firebase deploy

