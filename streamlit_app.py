import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

st.set_page_config(
    page_title="OCP Smart Maintenance Platform",
    page_icon="⚙️",
    layout="wide",
)

# ---------------------------------------------------------------------------
# Données simulées (à remplacer plus tard par une vraie source: BDD, API, CSV)
# ---------------------------------------------------------------------------

EQUIPEMENTS = [
    "Convoyeur C-101", "Convoyeur C-102", "Hydrocyclone H-01",
    "Cellule de flottation F-01", "Cellule de flottation F-02",
    "Épaississeur E-01", "Filtre-presse P-01",
]

@st.cache_data
def generate_kpi_history(days=30):
    dates = pd.date_range(end=datetime.today(), periods=days)
    rng = np.random.default_rng(42)
    bpl = 32 + rng.normal(0, 0.6, days).cumsum() * 0.05 + 32
    bpl = np.clip(bpl, 28, 36)
    mass_recovery = np.clip(78 + rng.normal(0, 1.2, days).cumsum() * 0.03, 70, 88)
    disponibilite = np.clip(92 + rng.normal(0, 1.5, days).cumsum() * 0.02, 80, 99)
    return pd.DataFrame({
        "date": dates,
        "BPL (%)": bpl,
        "Récupération massique (%)": mass_recovery,
        "Disponibilité (%)": disponibilite,
    })

@st.cache_data
def generate_equipment_status():
    rng = np.random.default_rng(7)
    data = []
    for eq in EQUIPEMENTS:
        health = rng.integers(55, 100)
        vibration = round(rng.uniform(1.5, 9.5), 2)
        temperature = round(rng.uniform(35, 78), 1)
        if health >= 80:
            statut = "OK"
        elif health >= 60:
            statut = "Surveillance"
        else:
            statut = "Alerte"
        data.append({
            "Équipement": eq,
            "Santé (%)": health,
            "Vibration (mm/s)": vibration,
            "Température (°C)": temperature,
            "Statut": statut,
            "Prochaine maintenance": (datetime.today() + timedelta(days=int(rng.integers(2, 45)))).strftime("%d/%m/%Y"),
        })
    return pd.DataFrame(data)

STATUT_COLOR = {"OK": "#2ecc71", "Surveillance": "#f39c12", "Alerte": "#e74c3c"}

# ---------------------------------------------------------------------------
# Sidebar
# ---------------------------------------------------------------------------

st.sidebar.title("⚙️ OCP Smart Maintenance")
st.sidebar.caption("Plateforme intelligente de maintenance prédictive")
page = st.sidebar.radio(
    "Navigation",
    ["📊 Dashboard KPIs", "🔧 Maintenance prédictive", "🏭 Process de traitement"],
)
st.sidebar.divider()
st.sidebar.info("Projet de Fin d'Année (PFA)\nOCP — Fiabilité, Maintenance & Digitalisation")

# ---------------------------------------------------------------------------
# Page 1 : Dashboard KPIs
# ---------------------------------------------------------------------------

if page == "📊 Dashboard KPIs":
    st.title("📊 Dashboard KPIs — Usine de traitement")
    st.caption("Indicateurs clés de performance du circuit de bénéfication du phosphate")

    kpi_df = generate_kpi_history()
    last = kpi_df.iloc[-1]
    prev = kpi_df.iloc[-2]

    col1, col2, col3 = st.columns(3)
    col1.metric("Teneur BPL", f"{last['BPL (%)']:.1f} %", f"{last['BPL (%)'] - prev['BPL (%)']:.2f} %")
    col2.metric("Récupération massique", f"{last['Récupération massique (%)']:.1f} %",
                f"{last['Récupération massique (%)'] - prev['Récupération massique (%)']:.2f} %")
    col3.metric("Disponibilité globale", f"{last['Disponibilité (%)']:.1f} %",
                f"{last['Disponibilité (%)'] - prev['Disponibilité (%)']:.2f} %")

    st.divider()

    tab1, tab2, tab3 = st.tabs(["BPL", "Récupération massique", "Disponibilité"])
    with tab1:
        fig = px.line(kpi_df, x="date", y="BPL (%)", markers=True)
        fig.update_traces(line_color="#1f77b4")
        st.plotly_chart(fig, use_container_width=True)
    with tab2:
        fig = px.line(kpi_df, x="date", y="Récupération massique (%)", markers=True)
        fig.update_traces(line_color="#2ca02c")
        st.plotly_chart(fig, use_container_width=True)
    with tab3:
        fig = px.line(kpi_df, x="date", y="Disponibilité (%)", markers=True)
        fig.update_traces(line_color="#ff7f0e")
        st.plotly_chart(fig, use_container_width=True)

# ---------------------------------------------------------------------------
# Page 2 : Maintenance prédictive
# ---------------------------------------------------------------------------

elif page == "🔧 Maintenance prédictive":
    st.title("🔧 Maintenance prédictive des équipements")
    st.caption("État de santé estimé, vibrations et température des équipements critiques")

    eq_df = generate_equipment_status()

    n_alerte = (eq_df["Statut"] == "Alerte").sum()
    n_surv = (eq_df["Statut"] == "Surveillance").sum()
    n_ok = (eq_df["Statut"] == "OK").sum()

    col1, col2, col3 = st.columns(3)
    col1.metric("✅ Équipements OK", n_ok)
    col2.metric("🟠 En surveillance", n_surv)
    col3.metric("🔴 En alerte", n_alerte)

    st.divider()

    selected_status = st.multiselect(
        "Filtrer par statut", options=["OK", "Surveillance", "Alerte"],
        default=["OK", "Surveillance", "Alerte"],
    )
    filtered = eq_df[eq_df["Statut"].isin(selected_status)]

    st.dataframe(
        filtered.style.apply(
            lambda row: [f"background-color: {STATUT_COLOR[row['Statut']]}22"] * len(row), axis=1
        ),
        use_container_width=True,
        hide_index=True,
    )

    st.divider()
    st.subheader("Santé des équipements")
    fig = px.bar(
        eq_df.sort_values("Santé (%)"), x="Santé (%)", y="Équipement", orientation="h",
        color="Statut", color_discrete_map=STATUT_COLOR,
    )
    st.plotly_chart(fig, use_container_width=True)

    st.subheader("Vibration vs Température")
    fig2 = px.scatter(
        eq_df, x="Température (°C)", y="Vibration (mm/s)", color="Statut",
        size="Santé (%)", hover_name="Équipement", color_discrete_map=STATUT_COLOR,
    )
    st.plotly_chart(fig2, use_container_width=True)

# ---------------------------------------------------------------------------
# Page 3 : Process de traitement
# ---------------------------------------------------------------------------

else:
    st.title("🏭 Circuit de traitement — Usine de bénéfication")
    st.caption("Vue simplifiée du process : lavage, classification, flottation, épaississement, filtration")

    etapes = [
        ("Débourbage / Lavage", "OK"),
        ("Classification (hydrocyclones)", "OK"),
        ("Flottation inverse", "Surveillance"),
        ("Épaississement", "OK"),
        ("Filtration", "Alerte"),
    ]

    cols = st.columns(len(etapes))
    for col, (nom, statut) in zip(cols, etapes):
        with col:
            st.markdown(
                f"""
                <div style="border:2px solid {STATUT_COLOR[statut]};border-radius:10px;
                padding:16px;text-align:center;min-height:120px;">
                <b>{nom}</b><br><br>
                <span style="color:{STATUT_COLOR[statut]};font-weight:bold;">{statut}</span>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.divider()
    st.subheader("Notes")
    st.write(
        "Cette vue est une démonstration simplifiée du circuit de traitement. "
        "Chaque étape peut être reliée à des capteurs réels (débit, pression, "
        "vibration) pour un suivi en temps réel dans une version future."
    )
