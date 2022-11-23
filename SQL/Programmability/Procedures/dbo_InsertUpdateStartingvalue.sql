SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertUpdateStartingvalue]
(
@CompanyID int,
@AP nvarchar(50),
@PO  nvarchar(50),
@Invoice nvarchar(50),
@CreatedBy int ,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

if exists(select * from StartingValue where CompanyID=@CompanyID)
begin

update StartingValue set AP=@AP,PO=@PO,Invoice=@Invoice,ModifiedDate=CURRENT_TIMESTAMP,ModifiedBy=@CreatedBy 
where CompanyID=@CompanyID

end
else
begin

insert into StartingValue (CompanyID,AP,PO,Invoice,CreatedDate,CreatedBy,ProdID) values
(@CompanyID,@AP,@PO,@Invoice,CURRENT_TIMESTAMP,@CreatedBy,@ProdID)

end

END





GO