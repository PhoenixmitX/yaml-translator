type Language = {
	name: string,
	code: string,
	source: boolean,
	target: boolean,
}

const lang = (code: string, name: string, source: boolean = true, target: boolean = true): Language => ({
	code,
	name,
	source,
	target,
})

const languages = [
	lang("null", "auto", true, false),
	lang("BG", "Bulgarian"),
	lang("CS", "Czech"),
	lang("DA", "Danish"),
	lang("DE", "German"),
	lang("EL", "Greek"),
	lang("EN", "English", true, false),
	lang("EN-GB", "English (British)", false, true),
	lang("EN-US", "English (American)", false, true),
	lang("ES", "Spanish"),
	lang("ET", "Estonian"),
	lang("FI", "Finnish"),
	lang("FR", "French"),
	lang("HU", "Hungarian"),
	lang("ID", "Indonesian"),
	lang("IT", "Italian"),
	lang("JA", "Japanese"),
	lang("KO", "Korean"),
	lang("LT", "Lithuanian"),
	lang("LV", "Latvian"),
	lang("NB", "Norwegian (Bokmål)"),
	lang("NL", "Dutch"),
	lang("PL", "Polish"),
	lang("PT", "Portuguese", true, false),
	lang("PT-BR", "Portuguese (Brazilian)", false, true),
	lang("PT-PT", "Portuguese (Portugal)", false, true),
	lang("RO", "Romanian"),
	lang("RU", "Russian"),
	lang("SK", "Slovak"),
	lang("SL", "Slovenian"),
	lang("SV", "Swedish"),
	lang("TR", "Turkish"),
	lang("UK", "Ukrainian"),
	lang("ZH", "Chinese"),
]

type DeepLDropDownProps = {
	label: string,
	value: string,
	onChange: (value: string) => void,
	type: "source" | "target",
}

export const DeepLDropDown = ({ label, value, onChange, type }: DeepLDropDownProps) => {
	return (
		<label>
			{label}
			<select
				style={{
					marginLeft: ".5rem",
				}}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{languages.filter(c => c[type]).map((lang) => (
					<option value={lang.code} key={lang.code}>{lang.name}</option>
				))}
			</select>
		</label>
	)
}
