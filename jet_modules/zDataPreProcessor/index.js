const isNotEmpty = (data) => (data !== '' && data !== undefined && data !== null);

const resourceKind = (cacd_family, bacteroidetes_add) => {
    switch (cacd_family.toLowerCase()) {
        case "archaea":
            return "Archaea";
        case "actinobacteria":
            return "Bacteria - Actinobacteria";
        case "firmicutes":
            return "Bacteria - Firmicutes";
        case "bacteroidetes외":
            if (bacteroidetes_add === '')
                return "Bacteria - Bacteroidetes외";
            else
                return "Bacteria - " + bacteroidetes_add;
        case "proteobacteria_alpha":
            return "Bacteria - Proteobacteria - Alphaproteobacteria";
        case "proteobacteria_beta":
            return "Bacteria - Proteobacteria - Betaproteobacteria";
        case "proteobacteria_gamma":
            return "Bacteria - Proteobacteria - Gammaproteobacteria";
        case "proteobacteria_delta":
            return "Bacteria - Proteobacteria - Deltaproteobacteria";
        case "proteobacteria_epsilon":
            return "Bacteria - Proteobacteria - Epsilonproteobacteria";
        case "yeast":
        case "yeasts":
            return "Yeast";
        case "mold":
        case "molds":
            return "Mold";
        case "plasmid":
        case "plasmids":
            return "Plasmid";
        default :
            return "Bacteria";
    }
}

const mediaInfo = (isKr, media_no, mda_add, media_no_noadd, linkdata, strainNo) => {
    let script = '';
    if (isNotEmpty(media_no)) {
        if (isNaN(media_no)) {
            script += media_no + ' / ';
        }
        else if (linkdata.media_no_link !== undefined) {
            script += mediaLink(isKr, linkdata.media_no_link, strainNo);
        }

        if (isNotEmpty(mda_add)) {
            script += '&nbsp; &nbsp (' + mda_add + ')';
        }
    }

    if (isNotEmpty(media_no_noadd)) {
        if (script !== '' && isNotEmpty(mda_add)) {
            script += '</br>';
        }
        else if (script !== '' && !isNotEmpty(mda_add)) {
            script += '/';
        }

        if (linkdata.media_no_noadd_link) {
            script += mediaLink(isKr, linkdata.media_no_noadd_link);
        }
    }

    return script;
}

const mediaLink = (isKr, linkdata, strainNo) => {
    return linkdata.map(item => {
        let temp = `<a style='color:blue; font-weight: bold; text-decoration: underline;'' class='noSelctCategory' href='${(isKr) ? "" : "/EN"}/_ktc/search/b/searchview?sn=${item.mda_no}&key=${strainNo}'> KCTC Media No. ${item.mda_no} : ${item.NAME} </a> / `
        while (temp.includes(`"`)) {
            temp = temp.replace(`"`, '');
        }
        while (temp.includes('`')) {
            temp = temp.replace('`', '<span style="font-style: italic">').replace('`', '</span>');
            
        }
        return temp;
    })
}

const sourceLink = (linkdata) => {
        let temp = `${linkdata}`
        while (temp.includes(`"`)) {
            temp = temp.replace(`"`, '');
        }
        while (temp.includes('`')) {
            temp = temp.replace('`', '<span style="font-style: italic">').replace('`', '</span>');
            
        }
        return temp;
   
}

const _reference = (isKr, type_strain, doi, strainNo) => {
    let script = ''
    if (isNotEmpty(type_strain)) {
        script += referenceLink(isKr, type_strain, strainNo).reduce((fullStr, item) => { return fullStr + ', ' + item });
    }

    if (isNotEmpty(doi)) {
        if (script !== '') script += ' / ';

        script += referenceLink(isKr, doi, strainNo).reduce((fullStr, item) => { return fullStr + ', ' + item });
    }

    return script
}

const referenceLink = (isKr, data, strainNo) => {
    let tempStr = data;
    if (data.toLowerCase().includes('type strain') || data.toLowerCase().includes('type_strain' )
        ||data.toLowerCase().includes('[') || data.toLowerCase().includes(']')) {
        tempStr = data.toLowerCase()
                        .replace('type', '')
                        .replace('strain', '')
                        .replace(']', '')
                        .replace('[', '')
                        .replace(/(\`|\.)/, '')
                        .replace(/(a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)/gi, '')
                        .replace(/\//g, ',');
    }
    const tempArray = tempStr.split(',');

    let scriptItems = tempArray.map(item => { 
        if (isDoi(item)) {
            return doiLink(item);
        }
        else if (item.length > 5 && item.includes('http')) {
            return `<a style='color:blue; font-weight: bold; text-decoration: underline;'' class='link' href='${item}'>${item}</a>`;
        } else if(item.includes('type') || item.includes('of') || item.includes('Type')) {
            return `<span>${item}</span>`;
        } else {
            return `<a style='color:blue; font-weight: bold; text-decoration: underline;'' class='link' href='${(isKr) ? "" : "/EN"}/search/DataRef?mic_no=${strainNo}&ref_no=${item}'>${item}</a>`;
        }
    });

    return scriptItems;
}

const isDoi = (data) => {
    return isNotEmpty(data) && (/10[.][0-9]{4,}/.test(data) || /doi/.test(data))
}

const doiLink = (data) => {
    let link = "http://dx.doi.org/" + data.replace("http://dx.doi.org/", "")
                                          .replace("dx.doi.org/", "")
                                          .replace("doi", "")
                                          .replace(":", "")

    return `<a style='color:blue; font-weight: bold; text-decoration: underline;'' class='link' href='${link}'>${data}</a>`
}

const genomeInfo = (NCBI_Genome_Information, JGI_Genome_Information) => {
    let script = ''
    let NCBI_genomeLink = ''
    let JGI_genomeLink = ''

    if (isNotEmpty(NCBI_Genome_Information)) {
        let tempStr = NCBI_Genome_Information.replace('ncbi.nlm.nih.gov/genome/', '=')
                                             .replace('?', '=');

        let tempArray = tempStr.split('=');
        if (tempArray.length > 1) {
            NCBI_genomeLink = `<a style='color:blue; font-weight: bold; text-decoration: underline;' target='_blank' href='${NCBI_Genome_Information}'>NCBI Genome UID : ${tempArray[1]}</a>`
        }
    }

    if (isNotEmpty(JGI_Genome_Information)) {
        let tempArray = JGI_Genome_Information.split('=');
        if (tempArray.length > 1) {
            JGI_genomeLink = `<a style='color:blue; font-weight: bold; text-decoration: underline;'' target='_blank' href='${JGI_Genome_Information}'>JGI Genome ID : ${tempArray[1]}</a>`
        }
    }

    script += NCBI_genomeLink;
    if (script !== '' && JGI_genomeLink !== '') {
        script += `<br/>`
    }
    script += JGI_genomeLink;

    return `<div style='line-height: 30px;'>${script}</div>`
}

const priceInfo = (price, active_price, dna_price, onlyActive) => {
    let script = `<div class="smallp"> * 부가가치세 10%가 추가 됩니다.<br/>`
                +    `<table class="tb3 ta_f">`
                +       `<colgroup>`
                +           `<col width="50%">`
                +           `<col width="50%">`
                +       `</colgroup>`
                +       `<thead>`
                +           `<tr>`
                +               `<th>Delivery form</th>`
                +               `<th>Price</th>`
                +           `</tr>`
                +       `</thead>`
    
    if (onlyActive !== '1' && onlyActive !== 'true') {
        script += `<tbody>`
                +       `<tr>`
                +           `<td>Freeze dried ampoule</td>`
                +           `<td> ￦ ${price}</td>`
                +       `</tr>`
    }
    script += `<tr>`
            +    `<td>Actively growing culture </td>`
            +    `<td> ￦ ${active_price}</td>`
            + `</tr>`
            + `</tbody></table></div>`
    
    return script
}

const strainName = name => {
    if (name === null) return;

    let temp = name;
    while (temp.includes(`"`)) {
        temp = temp.replace(`"`, '');
    }
    while (temp.includes('`')) {
        temp = temp.replace('`', '<span style="font-style: italic">').replace('`', '</span>');
        
    }

    return temp;
}

const buildDataset = (isKr, strainNo, kind, data, linkdata) => {
    if (isNaN(strainNo)) {
        switch (kind) {
            case 'Animal':
                return [
                    { key: 'KCTC No.',                  value: strainNo },
                    { key: 'Cell line Name',            value: strainName(data.name) },
                    { key: 'Kind',                      value: data.kind },
                    { key: 'Other Collection no.',      value: data.other_org_num },
                    { key: 'Medium',                    value: data.medium },
                    { key: 'Storage',                   value: data.storage },
                    { key: 'Culture Conditions',        value: data.culture_conditions },
                    { key: 'Cell line Origin',          value: data.cell_line_origin },
                    { key: 'Tissue',                    value: data.tissue },
                    { key: 'Virus Suspect',             value: data.virus_suspect },
                    { key: 'Products',                  value: data.products },
                    { key: 'Fluid Change',              value: data.fluid_change },
                    { key: 'Split Ratio',               value: data.split_ratio },
                    { key: 'Culture Characteristics',   value: data.growth_property },
                    { key: 'Reference',                 value: data.reference },
                    { key: 'Price',                     value: '￦ ' + data.price },
                ]
            case 'Plant':
                return [
                    { key: 'KCTC No.',                  value: strainNo },
                    { key: 'Old KCTC No.',              value: data.old_cell_line_no },
                    { key: 'Family Name',               value: data.familystrainName },
                    { key: 'Name',                      value: strainName(data.name) },
                    { key: 'Kind',                      value: data.kind },
                    { key: 'Author',                    value: strainName(data.author) },
                    { key: 'Year',                      value: data.year },
                    { key: 'Synonym',                   value: data.synonym },
                    { key: 'History',                   value: data.history },
                    { key: 'Other Collection No.',      value: data.other_org_num },
                    { key: 'Source',                    value: data.source },
                    { key: 'Products',                  value: data.products },
                    { key: 'Application',               value: data.application },
                    { key: 'Temperature',               value: data.temperature.replace('℃', '') + ' ℃' },
                    { key: 'KCTC Media No.',            value: data.media_no },
                    { key: 'Culture Morphology',        value: data.culture_morphology },
                    { key: 'Embryo Genic',              value: data.embryo_genic },
                    { key: 'Light Require',             value: data.light_require },
                    { key: 'ABTS Activity (90%)',       value: data.ABTS_ACTIVITY },
                    { key: 'DPPH Activity (90%)',       value: data.DPPH_ACTIVITY },
                    { key: 'SOD Activity (90%)',        value: data.SOD_ACTIVITY },
                    { key: 'Korean Name',               value: data.koreanstrainName },
                    { key: 'Price',                     value: '￦ ' + data.price },
                ]
            case 'Algae':
                return [
                    { key: 'KCTC No.',                  value: strainNo },
                    { key: 'Name',                      value: strainName(data.name) },
                    { key: 'Kind',                      value: data.kind },
                    { key: 'Genus',                     value: data.g_kind },
                    { key: 'Isolator',                  value: data.isolator },
                    { key: 'Other Collection No.',      value: data.other_org_num },
                    { key: 'Temperature',               value: data.temperature.replace('℃', '') + ' ℃' },
                    { key: 'Media No.',                 value: data.media_no },
                    { key: 'Morphology',                value: data.morphology },
                    { key: 'Price',                     value: '￦ ' + data.price },
                ]
        }
    }
    else {
        return [
            { key: 'KCTC No.',              value: strainNo },
            { key: 'Strain Name',           value: strainName(data.name) },
            { key: 'Kind',                  value: resourceKind(data.cacd_family, data.bacteroidetes_add)  },
            { key: 'Author',                value: strainName(data.author) },
            { key: 'Year',                  value: data.year },
            { key: 'Reference',             value: _reference(isKr, data.type_strain, data.doi, strainNo) },
            { key: 'Genome Information',    value: genomeInfo(data.NCBI_Genome_Information, data.JGI_Genome_Information) },
            { key: 'History',               value: data.history },
            { key: 'Other Collection No.',  value: data.other_org_num },
            { key: 'Source',                value: sourceLink(data.source)},
            { key: 'Product',               value: data.product },
            { key: 'Product2',              value: data.product2 },
            { key: 'Aero Condition',        value: data.aero_cond },
            { key: 'Application',           value: data.used_in },
            { key: 'Temperature',           value: data.temper.replace('℃', '') + ' ℃' },
            { key: 'Culture Method',        value: (data.cul_method === null || data.cul_method === '') ? '' : data.cul_method },
            { key: 'KCTC Media No.',        value: mediaInfo(isKr, data.media_no, data.mda_add, data.media_no_noadd, linkdata, strainNo) },
            { key: 'Biosafty Level',        value: data.security_level },
            { key: 'Price',                 value: priceInfo(data.price, data.active_price, data.dna_price, data.onlyActive) },
        ]
    }
}

module.exports = {
    buildDataset: buildDataset,
    strainName: strainName
};