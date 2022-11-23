SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[SettingsTaxCodesUpsert] 
	@TaxID	int,
	@TaxCode nvarchar(2),
	@TaxDescription nvarchar(50),
	@Active bit,
	@Createdby int,
	@Modifiedby int = null,
	@ProdId int
AS
BEGIN
SET NOCOUNT ON;

declare @tblReturn TABLE 
    (  
     ActionTaken nvarchar(10),  
	[TaxID] [int] NOT NULL,
	[TaxCode] [nvarchar](2) not NULL,
	[TaxDescription] [nvarchar](50) not NULL,
	[Active] [bit] not NULL default 1,
	[Createdby] [int] not NULL,
	[Modifiedby] [int] NULL,
	[Createddate] [datetime] not NULL default getdate(),
	[modifieddate] [datetime] NULL,
	[ProdId] [int] not NULL
    );  

Merge dbo.TaxCodeDetail as target
	using (select @TaxID,@TaxCode,	@TaxDescription,@Active,@Createdby,	@Modifiedby,@ProdId)
		as source (TaxID,TaxCode,TaxDescription,Active,Createdby,Modifiedby,ProdId)
	on (target.TaxCode = source.TaxCode and target.ProdID = source.ProdID)
when matched then
	Update  set TaxCode = source.TaxCode, TaxDescription = source.TaxDescription, Active = source.Active, Createdby = source.Createdby
	, Modifiedby = source.Modifiedby, ModifiedDate = getdate()
when not matched then
	Insert (TaxCode,TaxDescription, Active, Createdby, ProdID)
		values (source.TaxCode, source.TaxDescription, source.Active, source.Createdby, source.ProdID)
output $action, inserted.* into @tblReturn;

select * from @tblReturn;
END
GO