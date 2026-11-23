export const CMS_EDITOR_FIELDS = {
  "sobre": {
    "title": "Sobre nós",
    "path": "/sobre",
    "sections": {
      "institucional": {
        "title": "Apresentação institucional",
        "fields": [
          {
            "key": "title",
            "label": "Título"
          },
          {
            "key": "intro",
            "label": "Introdução"
          },
          {
            "key": "description",
            "label": "Nossa história"
          },
          {
            "key": "mission",
            "label": "Missão"
          },
          {
            "key": "vision",
            "label": "Visão"
          },
          {
            "key": "values",
            "label": "Valores"
          },
          {
            "key": "foundedYear",
            "label": "Ano de fundação"
          },
          {
            "key": "imageUrl",
            "label": "Imagem do banner"
          }
        ]
      }
    }
  },
  "processo": {
    "title": "Nosso processo",
    "path": "/processo",
    "sections": {
      "etapas": {
        "title": "Apresentação do processo",
        "fields": [
          {
            "key": "title",
            "label": "Título"
          },
          {
            "key": "description",
            "label": "Texto de apresentação"
          },
          {
            "key": "steps",
            "label": "Etapas (uma por linha)"
          }
        ]
      }
    }
  },
  "equipe": {
    "title": "Equipe",
    "path": "/equipe",
    "sections": {
      "introducao": {
        "title": "Apresentação da equipe",
        "fields": [
          {
            "key": "title",
            "label": "Título"
          },
          {
            "key": "description",
            "label": "Texto de apresentação"
          }
        ]
      }
    }
  },
  "contato": {
    "title": "Contato",
    "path": "/contato",
    "sections": {
      "contatos": {
        "title": "Informações de contato",
        "fields": [
          {
            "key": "title",
            "label": "Título"
          },
          {
            "key": "description",
            "label": "Texto de apresentação"
          },
          {
            "key": "whatsapp",
            "label": "WhatsApp (somente números)"
          },
          {
            "key": "instagram",
            "label": "Instagram (usuário)"
          },
          {
            "key": "email",
            "label": "E-mail"
          },
          {
            "key": "linkedin",
            "label": "LinkedIn (usuário)"
          },
          {
            "key": "address",
            "label": "Endereço"
          },
          {
            "key": "hours",
            "label": "Horários (uma linha por horário)"
          }
        ]
      }
    }
  }
} as const;
export type InstitutionalSlug = keyof typeof CMS_EDITOR_FIELDS;
