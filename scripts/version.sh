# get the existing version number
ver=$( sed -n 's/.*"version": "\(.*\)",/\1/p' package.json )    # ver='1.1.0'
echo "Current version: $ver"

a=( ${ver//./ } )                           # replace points, split into array
((a[2]++))                                  # increment revision (or other part)
newVer="${a[0]}.${a[1]}.${a[2]}"            # compose new version
echo "New version: $newVer"                 # newVer='1.1.1'

# write output
jq '(.version) |= '\"$newVer\"'' package.json  > temp.json && mv temp.json package.json

