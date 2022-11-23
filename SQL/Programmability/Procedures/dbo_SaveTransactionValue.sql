SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[SaveTransactionValue]
(
@TransactionCodeID int,
@TransValue nvarchar(50),
@Status bit,
@Description nvarchar(50),
@ProdID int,
@CreatedBy int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 if exists(select * from TransactionValue where TransactionCodeID=@TransactionCodeID and TransValue=@TransValue)	
 begin
 select '1'

end
else
begin
insert into TransactionValue (TransactionCodeID,TransValue,Status,Description,ProdID,CreatedDate,CreatedBy) values
(@TransactionCodeID,@TransValue,@Status,@Description,@ProdID,CURRENT_TIMESTAMP,@CreatedBy);

select '2'
end


END



GO