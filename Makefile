gh-pages:
	git checkout gh-pages
	git merge master
	cd app && npm run build
	cp app/dist/* .
	git add . && git commit -m "♻️ 📄"
	git push origin gh-pages
	git checkout master
