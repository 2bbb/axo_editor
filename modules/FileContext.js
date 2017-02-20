const path = require('path');
const fs = require('fs');
const xmljs = require('xml-js');

const misc_ids = require('./MiscIds.js');
const definition_ids = require('./DefinitionIds.js');
const code_ids = require('./CodeIds.js');

const templateXML = fs.readFileSync(path.join(__dirname, '../resource/template.xml'), 'utf8');
const templateData = JSON.parse(xmljs.xml2json(templateXML, { compact: true }));

class FileContext {
    constructor(file_path) {
        this.private = {
            path: file_path ? path.normalize(file_path) : undefined,
            data: null,
            editables: {},
        };
    }

    get editables() {
        return this.private.editables;
    }
    set editables(editables) {
        const { miscs, definitions, codes } = editables;
        if(!this.private.data) this.private.data = templateData;
        const objnormal = this.private.data.objdefs['obj.normal'];

        objnormal._attributes.id = miscs.id;
        objnormal._attributes.uuid = miscs.uuid;
        misc_ids.forEach(id => {
            if(!objnormal[id]) objnormal[id] = {};
            objnormal[id]._text = miscs[id] || '';
        });

        definition_ids.forEach(id => {
            if(!objnormal[id]) objnormal[id] = {};
            objnormal[id] = definitions[id] ? xmljs.xml2js(definitions[id], { compact: true, spaces: 2 }) : '';
        });

        code_ids.forEach(id => {
            if(!objnormal[`code.${id}`]) objnormal[`code.${id}`] = {};
            objnormal[`code.${id}`]._cdata = codes[id] || '';
        });

        return this.private.editables = editables;
    }
    get miscs() { return this.editables.miscs; }
    get definitions() { return this.editables.definitions; }
    get codes() { return this.editables.codes; }

    get path() { return this.private.path; }
    set path(file_path) { return this.private.path = file_path; } 
    get isOpen() { return !!this.private.data; }

    get xml() { return xmljs.json2xml(this.private.data, { compact: true, spaces: 2 }); }

    load(callback) {
        fs.readFile(this.path, 'utf8', (err, xml) => {
            if(err) return callback ? callback(err) : null;
            this.private.data = JSON.parse(xmljs.xml2json(xml, { compact: true, spaces: 2 }));
            const objnormal = this.private.data.objdefs['obj.normal'];

            const miscs = {
                id: objnormal._attributes.id,
                uuid: objnormal._attributes.uuid
            };
            for(const id of misc_ids) {
                miscs[id] = objnormal[id] ? (objnormal[id]._text || '') : '';
            }

            const definitions = {};
            for(const id of definition_ids) {
                definitions[id] = objnormal[id] ? xmljs.json2xml(objnormal[id], {compact: true, spaces: 4}) : '';
            }
            
            const codes = {};
            for(const id of code_ids) {
                codes[id] = objnormal[`code.${id}`] ? (objnormal[`code.${id}`]._cdata || '') : '';
            }
            
            this.private.editables = { miscs, definitions, codes };

            if(callback) callback(null, this);
        });
        return this;
    }

    save(editables, callback) {
        this.editables = editables;
        if(!this.isOpen) return callback ? callback({err: 'path is not setted.'}) : null;
        if(fs.existsSync(this.path)) fs.createReadStream(this.path).pipe(fs.createWriteStream(this.path + '.bak'));
        fs.writeFile(this.path, this.xml, (err) => {
           if(callback) callback(err);
        });
    }
};

module.exports = FileContext;